const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    telegramId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
    referrals: { type: Number, default: 0 },
    referredBy: { type: String, default: null }
});

module.exports = mongoose.model("User", userSchema);