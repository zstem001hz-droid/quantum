const { Schema, model } = require("mongoose");

// Task Schema
const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      // Optional — a task may be created with a title only
      type: String,
      trim: true,
    },
    status: {
      // Matches Kanban column labels in wireframes
      type: String,
      enum: ["To Do", "In Progress", "Complete"],
      default: "To Do",
    },
    project: {
      // References the parent project this task belongs to
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    owner: {
      // References the User who created the task
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Model Export
const Task = model("Task", taskSchema);
module.exports = Task;
