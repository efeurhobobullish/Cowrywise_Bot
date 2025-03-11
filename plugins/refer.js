const User = require("../models/user");

module.exports = async (bot, msg) => {
    const userId = msg.from.id;
    const chatId = msg.chat.id;

    try {
        // Get bot username
        const botInfo = await bot.getMe();
        const botUsername = botInfo.username;
        const referralLink = `https://t.me/${botUsername}?start=${userId}`;

        console.log("✅ Bot Username:", botUsername);
        console.log("✅ Referral Link:", referralLink);

        // Fetch or create user
        let user = await User.findOne({ userId });
        if (!user) {
            user = new User({ userId, referrals: [] });
            await user.save();
        }

        // Ensure referrals array exists
        if (!user.referrals) {
            user.referrals = [];
            await user.save();
        }

        // Count referrals
        const referralCount = user.referrals.length;

        // Format the link to prevent bending
        const formattedLink = `[${referralLink}](${referralLink})`;

        // Send referral message
        await bot.sendMessage(
            chatId,
            `👬 *Referral Program*\n\n` +
            `🎉 Total Referrals: *${referralCount}*\n\n` +
            `🔗 Your Referral Link:\n${formattedLink}\n\n` +
            `📢 Invite friends and earn rewards!`,
            { parse_mode: "MarkdownV2" } // Ensures the link is displayed correctly
        );

        console.log("✅ Referral message sent successfully.");
    } catch (error) {
        console.error("❌ Error in refer.js:", error.message);
        await bot.sendMessage(chatId, "❌ An error occurred. Please try again.");
    }
};