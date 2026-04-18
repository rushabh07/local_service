const express = require("express");
const router = express.Router();
const Service = require("../models/Service");

// Add service (admin)
router.post("/add", async (req, res) => {
    const service = new Service(req.body);
    console.log(service);
    await service.save();
    res.send("Service added");
});

// Get all services
router.get("/", async (req, res) => {
    const services = await Service.find();
    res.json(services);
});

router.get("/:id", async (req, res) => {
    const service = await Service.findById(req.params.id);
    console.log(service);
    res.json(service);
});

router.put("/:id", async (req, res) => {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body);
    res.json(service);
});

router.delete("/:id", async (req, res) => {
    const service = await Service.findByIdAndDelete(req.params.id);
    res.json(service);
});

module.exports = router;