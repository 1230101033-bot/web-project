const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    qty: { type: Number, required: true, min: 1 },
    costPrice: { type: Number, default: 0 },
    totalCost: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema);