const express = require("express");
const router = express.Router();
const Bookings = require("../models/Bookings");
const Provider = require("../models/Provider");

router.post("/add", async (req, res) => {
    try {
        const provider = await Provider.findOne({
            service: req.body.service,
            location: req.body.location,
            available: true
        });

        if (!provider) {
            return res.send("No provider available");
        }

        const booking = new Booking({
            userId: req.body.userId,
            providerId: provider._id,
            service: req.body.service,
            date: req.body.date
        });

        await booking.save();

        res.send("Booking successful");
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
});

router.get("/", async (req, res) => {
    const bookings = await Bookings.find();
    res.json(bookings);
});

router.put("/:id", async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Bookings.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(booking);
    } catch (e) {
        console.log(e);
        res.status(500).send("Server error");
    }
});

router.get("/provider/:id", async (req, res) => {
    const { id } = req.params;
    const bookings = await Bookings.find({ providerId: id });
    res.json(bookings);
});

module.exports = router;