const Product = require("../models/Product");
const Sale = require("../models/Sale");

// GET /api/dashboard  (matches Dashboard.vue cards)
const getDashboardStats = async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const lowStockCount = await Product.countDocuments({ stock: { $lte: 10 } });

  
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const todaySales = await Sale.aggregate([
    { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$total" },
        totalProfit: { $sum: "$profit" },
      },
    },
  ]);

  res.json({
    totalProducts,
    lowStock: lowStockCount,
    todaySales: todaySales[0]?.totalSales || 0,
    profit: todaySales[0]?.totalProfit || 0,
  });
};

module.exports = { getDashboardStats };