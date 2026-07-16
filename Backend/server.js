require("dotenv").config();
require("express-async-errors"); // makes thrown/rejected errors in async routes reach errorHandler
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/suppliers", require("./routes/supplierRoutes"));
app.use("/api/purchases", require("./routes/purchaseRoutes")); // Stock In
app.use("/api/sales", require("./routes/saleRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/settings", require("./routes/settingRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.get("/", (req, res) => res.send("Inventory API running..."));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// IMPORTANT: wait for MongoDB to actually finish connecting before accepting
// requests. Previously the server started listening immediately while
// connectDB() ran in the background — any request (e.g. adding a category or
// product) that arrived before Mongo finished connecting would just hang
// until Mongoose's internal buffering timeout (10s), then fail with a
// confusing "failed to load" error, even though Mongo eventually connected.
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});