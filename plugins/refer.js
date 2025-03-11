const User = require("../models/user");

module.exports = async (bot, msg) => {
    const userId = msg.from.id;
    const chatId = msg.chat.id;
    const botUsername = (await bot.getMe()).username;
    const referralLink = `https://t.me/${botUsername}?start=${userId}`;

    try {
        // Fetch user from DB
        let user = await User.findOne({ userId });
        if (!user) {
            user = new User({ userId });
            await user.save();
        }

        // Count referrals
        const referralCount = user.referrals.length;

        // Send referral message
        bot.sendMessage(
            chatId,
            `👬 *Referral Program*\n\n` +
            `🎉 Total Referrals: *${referralCount}*\n\n` +
            `🔗 Your Referral Link:\n${referralLink}\n\n` +
            `📢 Invite friends and earn rewards!`,
            { parse_mode: "Markdown" }
        );
    } catch (error) {
        console.error("❌ Error in refer.js:", error.message);
        bot.sendMessage(chatId, "❌ An error occurred. Please try again.");
    }
};