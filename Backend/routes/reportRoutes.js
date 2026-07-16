const express = require("express");
const router = express.Router();
const { inventoryReport, salesReport, purchaseReport } = require("../controllers/reportController");
const { protect } = require("../middleware/auth");

router.get("/inventory", protect, inventoryReport);
router.get("/sales", protect, salesReport);
router.get("/purchases", protect, purchaseReport);

module.exports = router;