const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Provider = require("../models/Provider");
const jwt = require("jsonwebtoken");// Register
router.post("/register", async (req, res) => {
    try {
        const { role, email } = req.body;
        
        const existingUser = await User.findOne({ email });
        const existingProvider = await Provider.findOne({ email });
        
        if (existingUser || existingProvider) {
            return res.json({ message: "This user is alredy exists.", reg: false });
        }

        if (role === "provider") {
            const providerData = { ...req.body };
            if (providerData.uid) {
                providerData.providerId = providerData.uid;
            }
            const provider = new Provider(providerData);
            await provider.save();
            console.log("REGISTER HIT - PROVIDER");
            return res.json({ message: "Provider Registered", reg: true });
        } else {
            const user = new User(req.body);
            await user.save();
            console.log("REGISTER HIT");
            return res.json({ message: "User Registered", reg: true });
        }
    }
    catch (error) {
        res.json({ message: "This user is alredy exists.", reg: false })

    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    // console.log(email, password);
    let user = await User.findOne({ email });
    let isProvider = false;
    let role = user ? user.role : null;

    if (!user) {
        user = await Provider.findOne({ email });
        isProvider = !!user;
        role = "provider";
    }

    if (!user || user.password !== password) {
        return res.json({
            log: false,
            message: "Invalid email or password"
        });
    }

    const token = jwt.sign(
        { id: user._id, role: role },
        "secretkey",
        { expiresIn: "1h" }
    );

    const userObj = user.toObject();
    if (isProvider) {
        userObj.role = "provider";
        if (!userObj.uid) userObj.uid = userObj.providerId || "";
    }

    res.json({
        log: true,
        user: userObj,
        token
    });
});

router.get("/", async (req, res) => {
    const users = await User.find();
    const providers = await Provider.find();
    
    const mappedProviders = providers.map(p => {
        const obj = p.toObject();
        obj.role = "provider";
        obj.uid = obj.providerId || "";
        return obj;
    });

    res.json([...users, ...mappedProviders]);
});

router.put("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: "User Updated", user });
    }
    catch (error) {
        res.json({ message: "User Update Failed", user });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User Deleted", user });
    }
    catch (error) {
        res.json({ message: "User Delete Failed", user });
    }
});

router.get("/users", async (req, res) => {
    const users = await User.find();
    const providers = await Provider.find();
    
    const mappedProviders = providers.map(p => {
        const obj = p.toObject();
        obj.role = "provider";
        obj.uid = obj.providerId || "";
        return obj;
    });

    res.json([...users, ...mappedProviders]);
});

router.get("/:id", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

module.exports = router;