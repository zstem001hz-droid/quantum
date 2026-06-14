const express = require("express");
const Project = require("../models/Project");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const { sendCollaborationInviteEmail } = require("../services/emailService");

const router = express.Router();

// Helper — returns true if user is project owner or member
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

// GET /api/projects — get all projects for logged-in user with populated member identities
router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    })
      .populate("owner", "name username email")
      .populate("members", "name username email");

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/projects/:id — get single project by ID with populated member identities
router.get("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name username email")
      .populate("members", "name username email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Ownership check
    if (!isOwnerOrMember(project, req.user._id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/projects — create new project
router.post("/", protect, async (req, res) => {
  const { name, description } = req.body;

  try {
    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/projects/:id — update project
router.put("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Ownership check
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/projects/:id/invite — invite a collaborator by email (owner only)
router.put("/:id/invite", protect, async (req, res) => {
  const { email } = req.body;

  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const invitee = await User.findOne({ email });
    if (!invitee) {
      return res.status(404).json({ message: "User not found" });
    }

    if (invitee._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot invite yourself" });
    }

    if (project.members.some((m) => m.toString() === invitee._id.toString())) {
      return res.status(400).json({ message: "User is already a collaborator" });
    }

    project.members.push(invitee._id);
    await project.save();

    // Send collaboration invite email — non-blocking, failure doesn't affect invite
    try {
      await sendCollaborationInviteEmail(invitee.email, project.name, req.user.name);
    } catch (emailError) {
      console.error("Invite email failed:", emailError.message);
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/projects/:id — delete project
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Ownership check
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await project.deleteOne();
    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
