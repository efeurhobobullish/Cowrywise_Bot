module.exports = async (bot, msg) => {
    const chatId = msg.chat.id;

    const keyboard = {
        keyboard: [
            ["💱 Convert Balance", "👬 Refer"],
            ["💰 Balance", "🎮 Game Zone", "📊 Statistics"],
            ["💳 Withdraw"],
            ["🗃 More"]
        ],
        resize_keyboard: true
    };

    await bot.sendMessage(chatId, "*Welcome To Cowrywise Gaming Bot 🤑🏦.*", {
        reply_markup: keyboard,
        parse_mode: "Markdown"
    });

    await bot.sendMessage(chatId, "*Note: Do Not Play Or Withdraw On Signup Bonus It's A Glitch*", { parse_mode: "Markdown" });
};
