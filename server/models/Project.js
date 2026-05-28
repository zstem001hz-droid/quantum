const { Schema, model } = require("mongoose");

// Project Schema
const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    description: {
      // Optional — a project may be created before a description is written
      type: String,
      trim: true,
    },
    status: {
      // Matches wireframe status badge — active | archived
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
    owner: {
      // References the User who created the project — drives authorization
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        // Collaborators invited by the owner — stretch goal
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Model Export
const Project = model("Project", projectSchema);
module.exports = Project;
