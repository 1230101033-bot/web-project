// Run this once on a fresh database to create the first Admin account:
//   node seed.js
//
// Change the values below (or set them via env vars) before running in production.
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");

const ADMIN_NAME = process.env.SEED_ADMIN_NAME || "Admin";
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@gmail.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "admin123";

(async () => {
  await connectDB();

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`ℹ️  User with email ${ADMIN_EMAIL} already exists. Nothing to do.`);
    await mongoose.disconnect();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: "Admin",
  });

  console.log("✅ Admin user created:");
  console.log(`   email:    ${ADMIN_EMAIL}`);
  console.log(`   password: ${ADMIN_PASSWORD}`);
  console.log("   Please log in and change this password right away.");

  await mongoose.disconnect();
})().catch((err) => {
  console.error("❌ Seeding failed:", err.message);
  process.exit(1);
});
