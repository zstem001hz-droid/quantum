const express = require("express");
const router = express.Router();
const { generateSecret, generateURI, verifySync } = require("otplib");
const QRCode = require("qrcode");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

// POST /api/2fa/setup - generate TOTP secret and QR code for authenticated user
router.post("/setup", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+twoFactorSecret");

    if (user.twoFactorEnabled) {
      return res.status(400).json({ message: "2FA is already enabled" });
    }

    // Generate a new TOTP secret
    const secret = generateSecret();

    // Build the otpauth URI for the QR code
    const otpauthUrl = generateURI({
      type: "totp",
      label: user.email,
      secret,
      issuer: "Quantum",
    });

    // Store secret temporarily - not enabled until verified
    user.twoFactorSecret = secret;
    await user.save();

    // Generate QR code as data URL for frontend display
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

    res.status(200).json({
      qrCode: qrCodeDataUrl,
      secret,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/2fa/verify - verify TOTP code and enable 2FA
router.post("/verify", protect, async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user._id).select("+twoFactorSecret");

    if (!user.twoFactorSecret) {
      return res.status(400).json({ message: "2FA setup not initiated" });
    }

    // Verify the provided TOTP token against the stored secret
    const result = verifySync({
      token,
      secret: user.twoFactorSecret,
      type: "totp",
    });
    const isValid = result?.valid === true;

    if (!isValid) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Enable 2FA on confirmed verification
    user.twoFactorEnabled = true;
    await user.save();

    res.status(200).json({ message: "2FA enabled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/2fa/disable - disable 2FA for authenticated user
router.post("/disable", protect, async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user._id).select("+twoFactorSecret");

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ message: "2FA is not enabled" });
    }

    // Require valid TOTP token to disable - prevents unauthorized disabling
    const result = verifySync({
      token,
      secret: user.twoFactorSecret,
      type: "totp",
    });
    const isValid = result?.valid === true;

    if (!isValid) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    await user.save();

    res.status(200).json({ message: "2FA disabled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/2fa/authenticate - validate TOTP during login
router.post("/authenticate", async (req, res) => {
  try {
    const { userId, token } = req.body;
    const user = await User.findById(userId).select("+twoFactorSecret");

    if (!user || !user.twoFactorEnabled) {
      return res.status(400).json({ message: "2FA not enabled for this user" });
    }

    const result = verifySync({
      token,
      secret: user.twoFactorSecret,
      type: "totp",
    });
    const isValid = result?.valid === true;

    if (!isValid) {
      return res.status(401).json({ message: "Invalid authentication code" });
    }

    res.status(200).json({ message: "2FA authentication successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
