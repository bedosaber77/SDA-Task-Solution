const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { collection: "Projects" }
);

module.exports = mongoose.model("Project", projectSchema);
