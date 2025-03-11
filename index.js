const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const config = require("./config");

const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { webhook: true });

const startCommand = require("./plugins/start");
const joinedCommand = require("./plugins/joined");
const checkCommand = require("./plugins/check");
const mainCommand = require("./plugins/main");
const backCommand = require("./plugins/back");

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("✅ Bot is running"));

app.post(`/webhook/${config.TELEGRAM_BOT_TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Start Express server
app.listen(config.PORT, async () => {
    console.log(`✅ Server running on port ${config.PORT}`);

    // Set webhook
    const webhookUrl = `${config.RENDER_URL}/webhook/${config.TELEGRAM_BOT_TOKEN}`;
    
    try {
        const setWebhookResponse = await bot.setWebhook(webhookUrl);
        if (setWebhookResponse) {
            console.log(`✅ Webhook set successfully: ${webhookUrl}`);
        } else {
            console.error("❌ Failed to set webhook. API response was empty.");
        }
    } catch (error) {
        console.error("❌ Webhook setup error:", error);
    }
});

// Error handling
bot.on("polling_error", (error) => console.error("❌ Polling Error:", error));

bot.on("message", async (msg) => {
    try {
        const text = msg.text;
        if (!text) return;

        if (text === "/start") return startCommand(bot, msg);
        if (text === "/joined") return joinedCommand(bot, msg);
        if (text === "/check") return checkCommand(bot, msg);
        if (text === "🔙 back") return backCommand(bot, msg);

    } catch (error) {
        console.error("❌ Error handling message:", error);
        await bot.sendMessage(msg.chat.id, "❌ An error occurred. Please try again.");
    }
});

console.log("✅ Bot is fully running...");