const { TELEGRAM_BOT_TOKEN, CHANNELS } = require("../config.js");
const axios = require("axios");

module.exports = async (bot, query) => {
    const userId = query.from.id;
    const chatId = query.message.chat.id;

    const apiUrl = `https://membership.bjcoderx.workers.dev/?bot_token=${TELEGRAM_BOT_TOKEN}&user_id=${userId}&chat_id=${encodeURIComponent(JSON.stringify(CHANNELS))}`;

    try {
        const response = await axios.get(apiUrl);
        const { status, is_joined } = response.data;

        if (status === "false") {
            return bot.sendMessage(chatId, "⚠️ *Please make the bot an admin in your channels.*", { parse_mode: "Markdown" });
        }

        if (is_joined) {
            await bot.sendMessage(chatId, "✅ *Thank you for joining our channels!*", { parse_mode: "Markdown" });
            bot.runCommand("main");
        } else {
            await bot.sendMessage(chatId, "⚠️ *You need to join all channels to use this bot.*", { parse_mode: "Markdown" });
        }
    } catch (error) {
        console.error("Error checking channel membership:", error);
        await bot.sendMessage(chatId, "❌ *An error occurred. Try again later.*", { parse_mode: "Markdown" });
    }
};
