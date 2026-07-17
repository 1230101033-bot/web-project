require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/suppliers", require("./routes/supplierRoutes"));
app.use("/api/purchases", require("./routes/purchaseRoutes"));
app.use("/api/sales", require("./routes/saleRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/settings", require("./routes/settingRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.get("/", (req, res) => {
  res.send("Inventory API running...");
});

app.use(errorHandler);

module.exports = app;
