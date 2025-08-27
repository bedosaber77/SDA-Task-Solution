const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["ToDo", "InProgress", "Done"],
      default: "ToDo",
    },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    collection: "Tasks",
  }
);

module.exports = mongoose.model("Task", taskSchema);
