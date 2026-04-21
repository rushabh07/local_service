const express = require("express");
const router = express.Router();
const Bookings = require("../models/Bookings");
const Provider = require("../models/Provider");

// router.post("/add", async (req, res) => {
//     try {
//         const provider = await Provider.findOne({
//             service: req.body.service,
//             location: req.body.location,
//             available: true
//         });

//         if (!provider) {
//             return res.send("No provider available");
//         }

//         const booking = new Booking({
//             userId: req.body.userId,
//             providerId: provider._id,
//             service: req.body.service,
//             date: req.body.date
//         });

//         await booking.save();

//         res.send("Booking successful");
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Server error");
//     }
// });


router.post("/", async (req, res) => {
    try {
        console.log(req.body);
        const booking = new Bookings({
            customerId: req.body.customerId,
            providerId: req.body.providerId,
            serviceId: req.body.serviceId,
            date: req.body.date,
            time: req.body.time,
            address: req.body.address,
            note: req.body.note,
            amount: req.body.amount,
            status: "Pending"
        });

        console.log(booking)
        await booking.save();

        res.json(booking);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
});

router.get("/", async (req, res) => {
    const bookings = await Bookings.find();
    res.json(bookings);
});


router.get("/user/:id", async (req, res) => {
    try {
        const bookings = await Bookings.find({ customerId: req.params.id }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
    }
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

// router.get("/provider/:id", async (req, res) => {
//     const { id } = req.params;
//     const bookings = await Bookings.find({ providerId: id });
//     res.json(bookings);
// });


router.get("/provider/:id", async (req, res) => {
    try {
        const { id } = req.params;

        console.log("Provider ID:", id);

        const bookings = await Bookings.find({ providerId: id }).sort({ createdAt: -1 });

        console.log("Bookings:", bookings);

        res.status(200).json(bookings);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;