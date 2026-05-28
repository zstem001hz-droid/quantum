const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Schema Definition
const userSchema = new mongoose.Schema(
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
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields to every document
    timestamps: true,
  },
);

// Pre-Save Hook — Password Hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance Method — Password Verification
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Model Export
const User = mongoose.model("User", userSchema);

module.exports = User;
