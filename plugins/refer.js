const User = require("../models/user");

module.exports = async (bot, msg) => {
    const userId = msg.from.id;
    const chatId = msg.chat.id;

    try {
        // Get bot information
        const botInfo = await bot.getMe();
        const botUsername = botInfo.username; // Ensure it includes underscores
        const referralLink = `https://t.me/${botUsername}?start=${userId}`;

        console.log("✅ Bot Username:", botUsername);
        console.log("✅ Referral Link:", referralLink);

        // Fetch user from DB
        let user = await User.findOne({ userId });

        if (!user) {
            console.log("❌ User not found, creating a new one...");
            user = new User({ userId, referrals: [] }); // Ensure referrals array exists
            await user.save();
        } else {
            console.log("✅ User found in database.");
        }

        // Ensure referrals array exists
        if (!user.referrals) {
            user.referrals = [];
            await user.save();
        }

        // Count referrals
        const referralCount = user.referrals.length;

        // Send referral message
        await bot.sendMessage(
            chatId,
            `👬 *Referral Program*\n\n` +
            `🎉 Total Referrals: *${referralCount}*\n\n` +
            `🔗 Your Referral Link:\n${referralLink}\n\n` +
            `📢 Invite friends and earn rewards!`,
            { parse_mode: "Markdown" }
        );

        console.log("✅ Referral message sent successfully.");
    } catch (error) {
        console.error("❌ Error in refer.js:", error.message);
        await bot.sendMessage(chatId, "❌ An error occurred. Please try again.");
    }
};