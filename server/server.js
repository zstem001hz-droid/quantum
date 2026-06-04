// Copyright (c) 2026 Zac White. All Rights Reserved.
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/connection");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const rateLimit = require("express-rate-limit");

// Connect to MongoDB
connectDB();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP per window
  message: { message: "Too many requests, please try again later" },
});

app.use(limiter);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentails: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects/:projectId/tasks", taskRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Quantum API is running" });
});

// PORT and listen
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Quantum is running on port ${PORT}`);
});
