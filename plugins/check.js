const axios = require("axios");
const config = require("../config");
const mainCommand = require("../plugins/main");

module.exports = async (bot, msg) => {
    const userId = msg.from.id;
    const channels = config.CHANNELS;

    try {
        const response = await axios.get(`https://membership.bjcoderx.workers.dev/?bot_token=${config.TELEGRAM_BOT_TOKEN}&user_id=${userId}&chat_id=${encodeURIComponent(JSON.stringify(channels))}`);
        const { status, is_joined } = response.data;

        if (status === "false") {
            return bot.sendMessage(userId, "❌ *Please make the bot an admin on all required channels.*");
        }

        if (is_joined) {
            bot.sendMessage(userId, "✅ *Thank you for joining! Loading main menu...*");
            return mainCommand(bot, msg);
        } else {
            return bot.sendMessage(userId, "⚠️ *You need to join all channels to continue.*", {
                reply_markup: { inline_keyboard: [[{ text: "📢 Join Channels", url: "https://t.me/" + channels[0].replace("@", "") }]] }
            });
        }
    } catch (error) {
        return bot.sendMessage(userId, "❌ *An error occurred. Try again later.*");
    }
};