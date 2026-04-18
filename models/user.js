const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
        type: String,
        enum: ["customer", "admin", "provider"],
        default: "customer"
    },

    phone: String,
    avatar: String,
    address: String,

    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
    }],

    joinedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("User", userSchema);