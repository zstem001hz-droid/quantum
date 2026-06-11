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
    assignedTo: {
      //References the User this task is assigned to - optional
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    dueDate: {
      // Optional deadline for task completion
      type: Date,
      default: null,
    },
  },

  {
    timestamps: true,
  },
);

// Model Export
const Task = model("Task", taskSchema);
module.exports = Task;
