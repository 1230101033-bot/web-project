const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 1 }, // selling price per unit
    total: { type: Number, required: true },
    profit: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);