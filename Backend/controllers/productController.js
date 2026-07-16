const Product = require("../models/Product");

// GET /api/products  (matches Products.vue "products" list)
const getProducts = async (req, res) => {
  const products = await Product.find().populate("category", "name").sort({ createdAt: -1 });
  res.json(products);
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category", "name");
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

// POST /api/products  (matches AddProductForm.vue "submitForm")
const addProduct = async (req, res) => {
  const { name, sku, price, stock, category } = req.body;

  if (!name) return res.status(400).json({ message: "Name required" });
  if (!sku) return res.status(400).json({ message: "SKU required" });
  if (!price || isNaN(price) || Number(price) <= 0) {
    return res.status(400).json({ message: "Invalid price" });
  }
  if (stock === undefined || stock === "" || isNaN(stock) || Number(stock) < 0) {
    return res.status(400).json({ message: "Invalid stock" });
  }

  const skuExists = await Product.findOne({ sku });
  if (skuExists) {
    return res.status(400).json({ message: "SKU already exists" });
  }

  const product = await Product.create({
    name,
    sku,
    price: Number(price),
    stock: Number(stock),
    category: category || undefined,
  });

  res.status(201).json(product);
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const { name, sku, price, stock, category } = req.body;

  if (name) product.name = name;
  if (sku) product.sku = sku;
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  if (category) product.category = category;

  const updated = await product.save();
  res.json(updated);
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  await product.deleteOne();
  res.json({ message: "Product deleted" });
};

module.exports = { getProducts, getProductById, addProduct, updateProduct, deleteProduct };