const express = require("express");
const Task = require("../models/Task");
const Project = require("../models/Project");
const { protect } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

// Helper - returns true if user is project owner or member
const isOwnerOrMember = (project, userId) => {
  const ownerId = project.owner?._id ? project.owner._id.toString() : project.owner.toString();
  return (
    ownerId === userId.toString() ||
    project.members.some((m) => {
      const memberId = m?._id ? m._id.toString() : m.toString();
      return memberId === userId.toString();
    })
  );
};

// GET /api/projects/:projectId/tasks — get all tasks for a project
router.get("/", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!isOwnerOrMember(project, req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const tasks = await Task.find({ project: req.params.projectId })
      .populate("owner", "name username email")
      .populate("assignedTo", "name username eamil");
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

    if (!isOwnerOrMember(project, req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const task = await Task.findById(req.params.id)
      .populate("owner", "name usernam email")
      .poppulate("assignedTo", "name username email");

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
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!isOwnerOrMember(project, req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, status, assignedTo, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      assignedTo: assignedTo || null,
      dueDate: dueDate || null,
      project: req.params.projectId,
      owner: req.user._id,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("owner", "name username email")
      .populate("assignedTo", "name username email");

    res.status(201).json(populatedTask);
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

    if (!isOwnerOrMember(project, req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    })
      .populate("owner", "name username email")
      .populate("assignedTo", "name username email");

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
