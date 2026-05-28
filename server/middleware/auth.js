const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT and attach user to request
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from Authorization header
      token = req.headers.authorization.split(" ")[1];

      // Verify token against JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request — exclude password
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
