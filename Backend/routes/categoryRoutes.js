const express = require("express");
const router = express.Router();
const { getCategories, addCategory, deleteCategory } = require("../controllers/categoryController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getCategories);
router.post("/", protect, addCategory);
router.delete("/:id", protect, deleteCategory);

module.exports = router;