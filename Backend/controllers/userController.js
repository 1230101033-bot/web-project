const bcrypt = require("bcryptjs");
const User = require("../models/User");

// GET /api/users  (matches Users.vue "users" list)
const getUsers = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
};

// POST /api/users  (matches Users.vue "add")
const addUser = async (req, res) => {
  const { name, email, role, password } = req.body;

  if (!name) return res.status(400).json({ message: "Name required" });
  if (!email) return res.status(400).json({ message: "Email required" });
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }
  if (!role) return res.status(400).json({ message: "Role required" });
  if (!["Admin", "Staff"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  // Agar password na diya ho to default temporary password set kar dete hain
  const rawPassword = password && password.length >= 6 ? password : "staff123";
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(rawPassword, salt);

  const user = await User.create({ name, email, role, password: hashedPassword });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

// PUT /api/users/:id  (role change / name update)
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, email, role } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (role && ["Admin", "Staff"].includes(role)) user.role = role;

  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
  });
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Admin apna khud ka account delete na kar sake
  if (req.user.id === req.params.id) {
    return res.status(400).json({ message: "You cannot delete your own account" });
  }

  await user.deleteOne();
  res.json({ message: "User deleted" });
};

module.exports = { getUsers, addUser, updateUser, deleteUser };