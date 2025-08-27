const project = require("../models/project.model");

module.exports.getAllProjects = async (req, res) => {
  try {
    const projects = await project.find();
    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newProject = new project({
      name,
      description,
    });
    await newProject.save();
    return res
      .status(201)
      .json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundProject = await project.findById(id);
    if (!foundProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json(foundProject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedProject = await project.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json({
      message: "Project deleted successfully",
      project: deletedProject,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
