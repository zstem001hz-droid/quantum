const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const nodemailer = require("nodemailer");

// Configure SMTP transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false, //true for port 465, false for 587 (TLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter connection on startup
transporter.verify((error) => {
  if (error) {
    console.error("EMail service error:", error.message);
  } else {
    console.log("Email service ready");
  }
});

// Send a password reset email with a tokenized reset link
const sendPasswordResetEmail = async (toEmail, resetToken) => {
  const resetUrl = `${process.env.CLIENT_ORIGIN}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: "Reset your Quantum password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Quantum</h2>
        <p>You requested a password reset. Click the link below to set a new password.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #6b7490; font-size: 13px;">This link expires in 1 hour. If you didn't request a reset, ignore this email.</p>
      </div>
    `,
  });
};

// Send a collaboration invitation email with a link to register or log in
const sendCollaborationInviteEmail = async (toEmail, projectName, inviterName) => {
  const loginUrl = `${process.env.CLIENT_ORIGIN}/login`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: `${inviterName} invited you to collaborate on ${projectName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Quantum</h2>
        <p><strong>${inviterName}</strong> has invited you to collaborate on <strong>${projectName}</strong>.</p>
        <a href="${loginUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0;">
          Open Quantum
        </a>
        <p style="color: #6b7490; font-size: 13px;">Log in or create an account to get started.</p>
      </div>
    `,
  });
};

module.exports = { sendPasswordResetEmail, sendCollaborationInviteEmail };
