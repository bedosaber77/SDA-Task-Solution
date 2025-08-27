const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt.util.js");
const User = require("../models/user.model.js");

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.find({
      username,
    });
    if (user.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    await newUser.save();
    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.find({
      username,
    });
    if (user.length === 0) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const token = generateToken(user[0]);
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user[0]._id,
        username: user[0].username,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
