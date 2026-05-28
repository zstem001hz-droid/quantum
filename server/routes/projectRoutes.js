const express = require("express");
const Project = require("../models/Project");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET /api/projects — get all projects for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
