module.exports = async (bot, msg) => {
    const content = msg.text;
    if (!content) return;

    try {
        const { status, is_joined } = JSON.parse(content);

        if (status === "false") {
            return bot.sendMessage(msg.chat.id, "⚠️ *Please make the bot an admin on all channels.*", { parse_mode: "Markdown" });
        }

        if (is_joined) {
            await bot.sendMessage(msg.chat.id, "✅ *Thank you for joining our channels!*", { parse_mode: "Markdown" });
            bot.runCommand("main");
        } else {
            await bot.sendMessage(msg.chat.id, "⚠️ *You need to join all channels to use this bot.*", { parse_mode: "Markdown" });
        }
    } catch (error) {
        console.error("Error processing check command:", error);
        await bot.sendMessage(msg.chat.id, "❌ *An error occurred. Try again later.*", { parse_mode: "Markdown" });
    }
};
