const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Provider = require("../models/Provider");

router.post("/book", async (req, res) => {
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

module.exports = router;