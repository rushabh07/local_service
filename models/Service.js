const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    title: { type: String, required: true },

    category: String,

    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Provider"
    },

    price: Number,

    priceType: {
        type: String,
        enum: ["fixed", "starting"]
    },

    rating: Number,

    reviewCount: Number,

    description: String,

    includes: [String],

    image: String,

    duration: String,

    popular: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Service", serviceSchema);