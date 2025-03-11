const { TELEGRAM_BOT_TOKEN, ADMIN_ID } = require("../config");
const axios = require("axios");

module.exports = async (bot, msg) => {
    try {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const firstName = msg.from.first_name;
        const username = msg.from.username || "No Username";

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

        await bot.sendMessage(ADMIN_ID, `🚦 *New User* 🚦  
🪵 *User:* ${firstName}  
👨‍💻 *Username:* @${username}  
🆔 *User ID:* ${userId}`, { parse_mode: "Markdown" });
        
    } catch (error) {
        console.error("❌ Error in start.js:", error);
        await bot.sendMessage(msg.chat.id, "❌ *An error occurred. Try again later.*");
    }
};