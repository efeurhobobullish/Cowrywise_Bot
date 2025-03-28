const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema({
    userId: { type: Number, required: true, unique: true },
    referralLink: { type: String, required: true },
    referrals: { type: Number, default: 0 },
    balance: { type: Number, default: 0.00 }
});

module.exports = mongoose.model("Referral", referralSchema);