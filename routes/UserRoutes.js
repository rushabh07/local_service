const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Register
router.post("/register", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        console.log("REGISTER HIT");
        res.json({ message: "User Registered", reg: true });
    }
    catch (error) {
        res.json({ message: "This user is alredy exists.", reg: false })

    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
        return res.json({
            log: false,
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        "secretkey",
        { expiresIn: "1h" }
    );

    res.json({
        log: true,
        user,
        token
    });
});

router.get("/", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

module.exports = router;