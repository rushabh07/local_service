const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
  name: String,
  service: String,
  location: String,
  available: Boolean
});

module.exports = mongoose.model("Provider", providerSchema);