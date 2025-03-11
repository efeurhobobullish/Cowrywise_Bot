const User = require("../database"); // Import User model

module.exports = async (bot, msg) => {
    try {
        const userId = msg.from.id;
        const chatId = msg.chat.id;
        const botUsername = (await bot.getMe()).username;

        // Generate referral link
        const inviteLink = `https://t.me/${botUsername}?start=${userId}`;

        // Get user's referral count
        const user = await User.findOne({ userId });
        const refCount = user ? user.referrals.length : 0;

        // Send referral information
        await bot.sendMessage(chatId, 
            `<b>🙌🏻 Total Referrals: ${refCount} User(s)\n\n` +
            `🙌🏻 Your Invite Link: ${inviteLink}\n\n` +
            `🪢 Invite to Earn ₦100 Per Invite</b>`, 
            { parse_mode: "HTML", disable_web_page_preview: true }
        );

    } catch (error) {
        console.error("❌ Error in refer command:", error.message);
    }
};