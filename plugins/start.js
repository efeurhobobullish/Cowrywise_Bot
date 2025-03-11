const { TELEGRAM_BOT_TOKEN, ADMIN_ID } = require("../config");
const User = require("../models/user");

module.exports = async (bot, msg) => {
    try {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const firstName = msg.from.first_name;
        const username = msg.from.username || "No Username";
        const text = msg.text.trim();
        const referredBy = text.split(" ")[1]; // Extract referrer ID

        // Check if user exists in DB
        let user = await User.findOne({ userId });
        if (!user) {
            user = new User({ userId, balance: 0, referrals: [] });

            // Handle referrals
            if (referredBy && referredBy !== userId.toString()) {
                let referrer = await User.findOne({ userId: referredBy });

                if (referrer) {
                    referrer.referrals.push(userId);
                    referrer.balance += 100; // Reward referrer (₦100)
                    await referrer.save();

                    // Notify referrer
                    await bot.sendMessage(
                        referredBy,
                        `🎉 Someone just joined using your referral link!\n💰 You've earned ₦100!`
                    );
                }
            }

            await user.save();
        }

        // Send join instructions
        const buttons = [
            [{ text: "𝐂𝐡𝐚𝐧𝐧𝐞𝐥", url: "https://t.me/cowrywise_gaming_channel" }],
            [{ text: "✅ Joined", callback_data: "joined" }]
        ];

        const messageText = `🌟 *Join Our Channels to Use This Bot!*  
After Joining, Click ✅ *Joined*`;

        await bot.sendMessage(chatId, messageText, {
            reply_markup: { inline_keyboard: buttons },
            parse_mode: "Markdown"
        });

        // Notify admin about the new user
        await bot.sendMessage(ADMIN_ID, `🚦 *New User* 🚦  
🪵 *User:* ${firstName}  
👨‍💻 *Username:* @${username}  
🆔 *User ID:* ${userId}`, { parse_mode: "Markdown" });

    } catch (error) {
        console.error("❌ Error in start.js:", error.message);
        await bot.sendMessage(msg.chat.id, "❌ *An error occurred. Try again later.*");
    }
};