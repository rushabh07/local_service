const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Register
router.post("/register", async (req, res) => {
const user = new User(req.body);
await user.save();
console.log("REGISTER HIT");
res.send("User Registered");
});

// Login
router.post("/login", async (req, res) => {
const { email, password } = req.body;

const user = await User.findOne({ email });

if (!user || user.password !== password) {
    return res.status(400).send("Invalid credentials");
}

res.send("Login Successful");
});

module.exports = router;