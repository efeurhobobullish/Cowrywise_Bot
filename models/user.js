const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: { type: Number, required: true, unique: true },
    balance: { type: Number, default: 0.00 },
    referrals: { type: [Number], default: [] } // Store referred user IDs
});

const User = mongoose.model("User", userSchema);

module.exports = User;