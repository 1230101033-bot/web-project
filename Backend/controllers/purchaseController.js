const Purchase = require("../models/Purchase");
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");

// GET /api/purchases  (matches PurchaseReport.vue)
const getPurchases = async (req, res) => {
  const purchases = await Purchase.find()
    .populate("supplier", "name")
    .populate("product", "name sku")
    .sort({ createdAt: -1 });
  res.json(purchases);
};

// POST /api/purchases  (matches StockIn.vue "add" -> alert("Stock added!"))
const addPurchase = async (req, res) => {
  const { supplier, product, qty, costPrice } = req.body;

  if (!supplier) return res.status(400).json({ message: "Supplier required" });
  if (!product) return res.status(400).json({ message: "Product required" });
  if (!qty || isNaN(qty) || Number(qty) <= 0) {
    return res.status(400).json({ message: "Invalid qty" });
  }

  const supplierExists = await Supplier.findById(supplier);
  if (!supplierExists) return res.status(404).json({ message: "Supplier not found" });

  const productDoc = await Product.findById(product);
  if (!productDoc) return res.status(404).json({ message: "Product not found" });

  const qtyNum = Number(qty);
  const cost = Number(costPrice) || 0;

  // 1) Purchase record banao
  const purchase = await Purchase.create({
    supplier,
    product,
    qty: qtyNum,
    costPrice: cost,
    totalCost: cost * qtyNum,
  });

  // 2) Product ka stock automatically increase karo
  productDoc.stock += qtyNum;
  await productDoc.save();

  const populated = await purchase.populate([
    { path: "supplier", select: "name" },
    { path: "product", select: "name sku stock" },
  ]);

  res.status(201).json({ message: "Stock added!", purchase: populated, newStock: productDoc.stock });
};

module.exports = { getPurchases, addPurchase };