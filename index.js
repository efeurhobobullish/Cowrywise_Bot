const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const config = require("./config");

const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { webHook: true });
const app = express();

app.use(express.json()); // Parse JSON

// Set webhook (replace YOUR_RENDER_URL once deployed)
const webhookURL = `https://cowrywise-bot.onrender.com/webhook`;
bot.setWebHook(webhookURL);

// Handle incoming updates
app.post("/webhook", (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Import commands
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

// Root route (for testing)
app.get("/", (req, res) => res.send("Bot is running"));

// Start server
app.listen(config.PORT, () => console.log(`🚀 Server running on port ${config.PORT}`));

console.log("✅ Bot is running...");