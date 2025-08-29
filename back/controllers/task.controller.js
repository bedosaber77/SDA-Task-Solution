const task = require("../models/Tasks.model");
const project = require("../models/project.model");
module.exports.getAllTasksForProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await task.find({ projectId });
    const projectExists = await project.findById(projectId);
    return res.status(200).json({
      project: projectExists,
      tasks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.createTask = async (req, res) => {
  try {
    const { projectId, title, description } = req.body;
    if (!projectId || !title) {
      return res
        .status(400)
        .json({ message: "Project ID and title are required" });
    }

    const newTask = new task({
      projectId,
      title,
      description,
    });
    await newTask.save();
    return res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    if (!taskId || !status) {
      return res
        .status(400)
        .json({ message: "Task ID and status are required" });
    }
    const updatedTask = await task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res
      .status(200)
      .json({ message: "Task status updated successfully", task: updatedTask });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }
    const deletedTask = await task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res
      .status(200)
      .json({ message: "Task deleted successfully", task: deletedTask });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
