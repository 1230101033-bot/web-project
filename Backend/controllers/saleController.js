const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Purchase = require("../models/Purchase");

// GET /api/sales  (matches SalesReport.vue)
const getSales = async (req, res) => {
  const sales = await Sale.find().populate("product", "name sku").sort({ createdAt: -1 });
  res.json(sales);
};

// Helper: product ka average cost price nikalna (last purchase se, simple approach)
const getLastCostPrice = async (productId) => {
  const lastPurchase = await Purchase.findOne({ product: productId }).sort({ createdAt: -1 });
  return lastPurchase ? lastPurchase.costPrice : 0;
};

// POST /api/sales  (matches Sales.vue "add" -> alert("Sale completed!"))
const addSale = async (req, res) => {
  const { product, qty, price } = req.body;

  if (!product) return res.status(400).json({ message: "Product required" });
  if (!qty || isNaN(qty) || Number(qty) <= 0) {
    return res.status(400).json({ message: "Invalid qty" });
  }
  if (!price || isNaN(price) || Number(price) <= 0) {
    return res.status(400).json({ message: "Invalid price" });
  }

  const productDoc = await Product.findById(product);
  if (!productDoc) return res.status(404).json({ message: "Product not found" });

  const qtyNum = Number(qty);
  const priceNum = Number(price);

  // Stock check — itna stock available hona chahiye
  if (productDoc.stock < qtyNum) {
    return res.status(400).json({ message: `Only ${productDoc.stock} in stock` });
  }

  // Profit calculate karo (last purchase cost price se)
  const costPrice = await getLastCostPrice(product);
  const total = priceNum * qtyNum;
  const profit = (priceNum - costPrice) * qtyNum;

  // 1) Sale record banao
  const sale = await Sale.create({
    product,
    qty: qtyNum,
    price: priceNum,
    total,
    profit,
  });

  // 2) Product ka stock automatically kam karo
  productDoc.stock -= qtyNum;
  await productDoc.save();

  const populated = await sale.populate("product", "name sku stock");

  res.status(201).json({
    message: "Sale completed!",
    sale: populated,
    remainingStock: productDoc.stock,
  });
};

module.exports = { getSales, addSale };