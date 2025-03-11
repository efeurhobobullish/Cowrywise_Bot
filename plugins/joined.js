const axios = require("axios");
const config = require("../config");

module.exports = async (bot, msg) => {
    const userId = msg.from.id;
    const channels = config.CHANNELS;

    if (!channels || channels.length === 0) {
        return bot.sendMessage(userId, "❌ No channels configured.");
    }

    try {
        const response = await axios.get(
            `https://membership.bjcoderx.workers.dev/?bot_token=${config.TELEGRAM_BOT_TOKEN}&user_id=${userId}&chat_id=${encodeURIComponent(JSON.stringify(channels))}`
        );

        const { status, is_joined } = response.data;

        if (status === "false") {
            return bot.sendMessage(userId, "❌ Please make the bot an admin in all channels.");
        }

        if (is_joined) {
            return bot.sendMessage(userId, "✅ Thank you for joining our channels!");
        } else {
            return bot.sendMessage(userId, "⚠️ You need to join all channels to use our bot.");
        }
    } catch (error) {
        console.error("Error checking channel membership:", error);
        return bot.sendMessage(userId, "❌ An error occurred. Try again later.");
    }
};