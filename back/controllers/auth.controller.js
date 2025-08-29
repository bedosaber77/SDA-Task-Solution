const bcrypt = require("bcrypt");
const { generateToken, validateToken } = require("../utils/jwt.util.js");
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
    const token = generateToken(newUser);
    res.cookie("token", token, { httpOnly: true, secure: false });
    return res.status(201).json({
      message: "User created successfully",
      user: { id: newUser._id, username: newUser.username },
    });
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
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 60 * 1000 * 5,
    });
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user[0]._id,
        username: user[0].username,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.verify = (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  const decoded = validateToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }
  return res.status(200).json({
    message: "Token is valid",
    user: {
      id: decoded.id,
      username: decoded.username,
    },
  });
};
