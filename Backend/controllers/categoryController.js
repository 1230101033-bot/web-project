const Category = require("../models/Category");

// GET /api/categories
const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
};

// POST /api/categories  (matches Categories.vue "add")
const addCategory = async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Category required" });
  }

  const exists = await Category.findOne({ name: name.trim() });
  if (exists) {
    return res.status(400).json({ message: "Category already exists" });
  }

  const category = await Category.create({ name: name.trim() });
  res.status(201).json(category);
};

// DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found" });
  await category.deleteOne();
  res.json({ message: "Category deleted" });
};

module.exports = { getCategories, addCategory, deleteCategory };