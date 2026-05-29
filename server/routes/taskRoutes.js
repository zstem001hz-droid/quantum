const express = require("express");
const Task = require("../models/Task");
const Project = require("../models/Project");
const { protect } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

// GET /api/projects/:projectId/tasks — get all tasks for a project
router.get("/", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const tasks = await Task.find({ project: req.params.projectId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/projects/:projectId/tasks/:id — get single task
router.get("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/projects/:projectId/tasks — create new task
router.post("/", protect, async (req, res) => {
  const { title, description, status } = req.body;

  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const task = await Task.create({
      title,
      description,
      status,
      project: req.params.projectId,
      owner: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/projects/:projectId/tasks/:id — update task
router.put("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/projects/:projectId/tasks/:id — delete task
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
