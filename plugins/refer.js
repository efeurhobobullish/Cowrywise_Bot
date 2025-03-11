const User = require("../models/user");

module.exports = async (bot, msg) => {
    const userId = msg.from.id.toString();
    const botUsername = (await bot.getMe()).username;
    const referralLink = `https://t.me/${botUsername}?start=${userId}`;

    let user = await User.findOne({ telegramId: userId });
    if (!user) {
        user = new User({ telegramId: userId });
        await user.save();
    }

    bot.sendMessage(
        msg.chat.id,
        `👬 *Refer & Earn*\n\n👥 *Total Referrals:* ${user.referrals}\n🔗 *Your Referral Link:* [Click Here](${referralLink})\n\n💰 *Earn ₦100 Per Invite!*`,
        { parse_mode: "Markdown", disable_web_page_preview: true }
    );
};