const { ADMIN_ID } = require("../config.js");

module.exports = async (bot, msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    const adminKeyboard = {
        reply_markup: {
            keyboard: [
                ["💰 Balance", "📥 Deposit", "💳 Withdraw"],
                ["🗂 Wallet", "👨‍💻 Admin", "🎟 Get Bonus"],
                ["📞 Support", "Terms & Conditions"],
                ["🔙 Back"]
            ],
            resize_keyboard: true
        }
    };

    const userKeyboard = {
        reply_markup: {
            keyboard: [
                ["💰 Balance", "📥 Deposit", "💳 Withdraw"],
                ["🗂 Wallet", "🎟 Get Bonus"],
                ["📞 Support", "Terms & Conditions"],
                ["🔙 Back"]
            ],
            resize_keyboard: true
        }
    };

    if (userId.toString() === ADMIN_ID) {
        await bot.sendMessage(chatId, "*Welcome to Additional Menu 🗃*", {
            parse_mode: "Markdown",
            ...adminKeyboard
        });
    } else {
        await bot.sendMessage(chatId, "*Welcome to Additional Menu 🗃*", {
            parse_mode: "Markdown",
            ...userKeyboard
        });
    }
};