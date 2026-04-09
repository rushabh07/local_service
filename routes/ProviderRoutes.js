const express = require("express");
const router = express.Router();
const Provider = require("../models/Provider");

// Add provider
router.post("/add", async (req, res) => {
const provider = new Provider(req.body);
await provider.save();
res.send("Provider added");
});

// Get providers
router.get("/", async (req, res) => {
const providers = await Provider.find();
res.json(providers);
});

module.exports = router;