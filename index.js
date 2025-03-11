const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const config = require("./config");

const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });

const startCommand = require("./commands/start");
const joinedCommand = require("./commands/joined");
const checkCommand = require("./commands/check");
const mainCommand = require("./commands/main");
const backCommand = require("./commands/back");

bot.on("message", async (msg) => {
    const text = msg.text;

    if (text === "/start") return startCommand(bot, msg);
    if (text === "/joined") return joinedCommand(bot, msg);
    if (text === "/check") return checkCommand(bot, msg);
    if (text === "🔙 back") return backCommand(bot, msg);
});

// Express Server (Optional, for Vercel)
const app = express();
app.get("/", (req, res) => res.send("Bot is running"));
app.listen(config.PORT, () => console.log(`Server running on port ${config.PORT}`));

// Error Handling
bot.on("polling_error", (error) => console.log(error.message));

console.log("✅ Bot is running...");
