const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT and attach user to request
const protect = async (req, res, next) => {
  // Token is read from an httpOnly cookie rather than the Authorization header — inaccessible to JavaScript (XSS mitigation)
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Verifies the CSRF token header matches the CSRF cookie (double-submit pattern)
// Required on all state-changing requests (POST/PUT/DELETE) once a session exists
const verifyCsrf = (req, res, next) => {
  const cookieToken = req.cookies.csrfToken;
  const headerToken = req.headers["x-csrf-token"];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  next();
};

module.exports = { protect, verifyCsrf };
