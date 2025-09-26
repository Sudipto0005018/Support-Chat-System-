const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email exists" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, passwordHash, role: role || "user" });
  await user.save();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "7d",
  });
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "7d",
  });
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};
