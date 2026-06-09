// Copyright (c) 2026 Zac White. All Rights Reserved.
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/connection");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const twoFactorRoutes = require("./routes/twoFactorRoutes");
const rateLimit = require("express-rate-limit");

// Initialize database connection
connectDB();

const app = express();

// Trust Render's reverse proxy for accurate IP-based rate limiting
app.set("trust proxy", 1);

// Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP per window
  message: { message: "Too many requests, please try again later" },
});

app.use(limiter);
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects/:projectId/tasks", taskRoutes);
app.use("/api/2fa", twoFactorRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Quantum API is running" });
});

// Server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Quantum is running on port ${PORT}`);
});
