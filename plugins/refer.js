const User = require("../models/user");

module.exports = async (bot, msg) => {
    const userId = msg.from.id;
    const chatId = msg.chat.id;

    try {
        // Get bot username (it already includes underscores if needed)
        const botInfo = await bot.getMe();
        const botUsername = botInfo.username; 
        const referralLink = `https://t.me/${botUsername}?start=${userId}`;

        // Fetch or create user in DB
        let user = await User.findOne({ userId });
        if (!user) {
            user = new User({ userId, referrals: [] }); // Ensure referrals array exists
            await user.save();
        }

        // Count referrals
        const referralCount = user.referrals ? user.referrals.length : 0;

        // Send referral message
        await bot.sendMessage(
            chatId,
            `👬 *Referral Program*\n\n` +
            `🎉 Total Referrals: *${referralCount}*\n\n` +
            `🔗 Your Referral Link:\n${referralLink}\n\n` +
            `📢 Invite friends and earn rewards!`,
            { parse_mode: "Markdown" }
        );
    } catch (error) {
        console.error("❌ Error in refer.js:", error.message);
        await bot.sendMessage(chatId, "❌ An error occurred. Please try again.");
    }
};