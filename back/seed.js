const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const DB = require("./config/db.js");
const User = require("./models/User.model.js");
const Project = require("./models/Project.model.js");
const Task = require("./models/Tasks.model.js");

const seed = async () => {
  try {
    // connect to DB
    await DB.connectDB();
    // clear old data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});

    console.log("🗑 Old data cleared");

    // create user
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await User.create({
      username: "testuser",
      password: hashedPassword,
    });

    console.log("👤 User created:", user.username);

    // create projects
    const project1 = await Project.create({
      title: "MERN Task Manager",
      description: "A simple project management system",
    });

    const project2 = await Project.create({
      title: "Formula Student",
      description: "Software for racing team management",
    });

    console.log("📂 Projects created:", project1.title, project2.title);

    // create tasks
    const tasks = await Task.insertMany([
      {
        title: "Setup MongoDB connection",
        status: "Done",
        projectId: project1._id,
      },
      {
        title: "Create Project model",
        status: "InProgress",
        projectId: project1._id,
      },
      {
        title: "Frontend UI with React",
        status: "ToDo",
        projectId: project2._id,
      },
    ]);

    console.log("✅ Tasks created:", tasks.length);

    process.exit(); // exit script
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
};

seed();
