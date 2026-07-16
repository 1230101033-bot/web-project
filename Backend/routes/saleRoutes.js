const express = require("express");
const router = express.Router();
const { getSales, addSale } = require("../controllers/saleController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getSales);
router.post("/", protect, addSale);

module.exports = router;