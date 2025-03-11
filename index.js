const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const config = require("./config");

const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: false }); // Webhook mode

const startCommand = require("./plugins/start");
const joinedCommand = require("./plugins/joined");
const checkCommand = require("./plugins/check");
const mainCommand = require("./plugins/main");
const backCommand = require("./plugins/back");

bot.on("message", async (msg) => {
    const text = msg.text;

    if (text === "/start") return startCommand(bot, msg);
    if (text === "/joined") return joinedCommand(bot, msg);
    if (text === "/check") return checkCommand(bot, msg);
    if (text === "🔙 back") return backCommand(bot, msg);
});

// Express Server for Webhook
const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("Bot is running"));

app.post(`/webhook/${config.TELEGRAM_BOT_TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Start the server
app.listen(config.PORT, async () => {
    console.log(`✅ Server running on port ${config.PORT}`);

    // Set webhook URL for Telegram
    const webhookUrl = `${config.RENDER_URL}/webhook/${config.TELEGRAM_BOT_TOKEN}`;
    try {
        await bot.setWebhook(webhookUrl);
        console.log(`✅ Webhook set: ${webhookUrl}`);
    } catch (error) {
        console.error("❌ Failed to set webhook:", error.message);
    }
});

// Error Handling
bot.on("polling_error", (error) => console.log("❌ Polling error:", error.message));

console.log("✅ Bot is running...");