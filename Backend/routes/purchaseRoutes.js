const express = require("express");
const router = express.Router();
const { getPurchases, addPurchase } = require("../controllers/purchaseController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getPurchases);
router.post("/", protect, addPurchase);

module.exports = router;