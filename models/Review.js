const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({

    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    rating: {
        type: Number,
        min: 1,
        max: 5
    },

    comment: String,

    approved: {
        type: Boolean,
        default: false
    },

    date: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Review", reviewSchema);