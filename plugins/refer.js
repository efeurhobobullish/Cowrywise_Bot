const User = require("../models/user");

module.exports = async (bot, msg) => {
    const userId = msg.from.id;
    const chatId = msg.chat.id;

    try {
        // Get bot username
        const botInfo = await bot.getMe();
        const botUsername = botInfo.username;

        // Escape special characters for MarkdownV2
        const escapeMarkdownV2 = (text) => {
            return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, "\\$&");
        };

        const escapedUsername = escapeMarkdownV2(botUsername);
        const referralLink = `https://t.me/${botUsername}?start=${userId}`;
        const formattedLink = `[Click Here](${escapeMarkdownV2(referralLink)})`;

        console.log("✅ Bot Username:", botUsername);
        console.log("✅ Escaped Username:", escapedUsername);
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

        // Send referral message
        await bot.sendMessage(
            chatId,
            `👬 *Referral Program*\n\n` +
            `🎉 Total Referrals: *${referralCount}*\n\n` +
            `🔗 Your Referral Link:\n${formattedLink}\n\n` +
            `📢 Invite friends and earn rewards\\!`,
            { parse_mode: "MarkdownV2" } // Fixes formatting issues
        );

        console.log("✅ Referral message sent successfully.");
    } catch (error) {
        console.error("❌ Error in refer.js:", error.message);
        await bot.sendMessage(chatId, "❌ An error occurred. Please try again.");
    }
};