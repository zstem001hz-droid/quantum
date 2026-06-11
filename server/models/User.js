const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

// User Schema Definition
const userSchema = new Schema(
  {
    name: {
      // Display Name
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    username: {
      // Unique handle - username used for lookup
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [5, "Username must be at least 5 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"],
      match: [/^[a-zA-Z0-9-]+$/, "Username can only contain letters, numbers, and hyphens"],
    },
    email: {
      // Email address - unique primary login identifier
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      // Stored as bcrypt hash — never returned in queries (select: false)
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    lastLogin: {
      // Timestamp of most recent successful login
      type: Date,
      default: null,
    },
    twoFactorSecret: {
      // TOTP secret key — generated during 2FA setup, never returned in queries
      type: String,
      default: null,
      select: false,
    },
    twoFactorEnabled: {
      // Whether the user has completed 2FA setup and enabled it
      type: Boolean,
      default: false,
    },
    passwordResetToken: {
      // Hashed reset token — generated on forgot password request
      type: String,
      default: null,
      select: false,
    },
    passwordResetExpires: {
      // Reset token expiry — token invalid after this timestamp
      type: Date,
      default: null,
    },
  },

  {
    // Automatically adds createdAt and updatedAt fields to every document
    timestamps: true,
  },
);

// Pre-Save Hook — Password Hashing
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance Method — Password Verification
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Model Export
const User = model("User", userSchema);

module.exports = User;
