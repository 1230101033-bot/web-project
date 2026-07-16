const Supplier = require("../models/Supplier");

// GET /api/suppliers
const getSuppliers = async (req, res) => {
  const suppliers = await Supplier.find().sort({ createdAt: -1 });
  res.json(suppliers);
};

// POST /api/suppliers  (matches Suppliers.vue "add")
const addSupplier = async (req, res) => {
  const { name, phone, address } = req.body;

  if (!name) return res.status(400).json({ message: "Name required" });
  if (!phone) return res.status(400).json({ message: "Phone required" });
  if (!/^\d{10,12}$/.test(phone)) {
    return res.status(400).json({ message: "Invalid phone" });
  }

  const supplier = await Supplier.create({ name, phone, address });
  res.status(201).json(supplier);
};

// PUT /api/suppliers/:id
const updateSupplier = async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) return res.status(404).json({ message: "Supplier not found" });

  const { name, phone, address } = req.body;
  if (name) supplier.name = name;
  if (phone) supplier.phone = phone;
  if (address !== undefined) supplier.address = address;

  const updated = await supplier.save();
  res.json(updated);
};

// DELETE /api/suppliers/:id
const deleteSupplier = async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);
  if (!supplier) return res.status(404).json({ message: "Supplier not found" });
  await supplier.deleteOne();
  res.json({ message: "Supplier deleted" });
};

module.exports = { getSuppliers, addSupplier, updateSupplier, deleteSupplier };