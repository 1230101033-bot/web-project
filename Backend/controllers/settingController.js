const Setting = require("../models/Setting");

// GET /api/settings  (matches Settings.vue)
const getSettings = async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({}); // defaults se ek record bana dega
  }
  res.json(settings);
};

// PUT /api/settings  (matches Settings.vue "Save Settings")
const updateSettings = async (req, res) => {
  const { storeName, currency, phone, address } = req.body;

  let settings = await Setting.findOne();
  if (!settings) settings = new Setting();

  if (storeName !== undefined) settings.storeName = storeName;
  if (currency !== undefined) settings.currency = currency;
  if (phone !== undefined) settings.phone = phone;
  if (address !== undefined) settings.address = address;

  const updated = await settings.save();
  res.json(updated);
};

module.exports = { getSettings, updateSettings };