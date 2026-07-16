const Product = require("../models/Product");
const Sale = require("../models/Sale");
const Purchase = require("../models/Purchase");

// GET /api/reports/inventory  (matches InventoryReport.vue)
const inventoryReport = async (req, res) => {
  const products = await Product.find().select("name stock");

  const report = products.map((p) => ({
    product: p.name,
    stock: p.stock,
    status: p.stock <= 10 ? "Low" : "OK", // threshold customize kar sakte hain
  }));

  res.json(report);
};

// GET /api/reports/sales  (matches SalesReport.vue) - date-wise grouped
const salesReport = async (req, res) => {
  const report = await Sale.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        total: { $sum: "$total" },
        profit: { $sum: "$profit" },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  res.json(
    report.map((r) => ({ date: r._id, total: r.total, profit: r.profit }))
  );
};

// GET /api/reports/purchases  (matches PurchaseReport.vue) - date-wise grouped
const purchaseReport = async (req, res) => {
  const report = await Purchase.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalCost: { $sum: "$totalCost" },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  
  res.json(
    report.map((r) => ({ date: r._id, totalCost: r.totalCost }))
  );
};

module.exports = { inventoryReport, salesReport, purchaseReport };