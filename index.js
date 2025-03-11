const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const axios = require("axios");
const config = require("./config");

const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { webHook: true });

const startCommand = require("./plugins/start");
const joinedCommand = require("./plugins/joined");
const checkCommand = require("./plugins/check");
const mainCommand = require("./plugins/main");
const main2Command = require("./plugins/main2"); // Handles "More"
const backCommand = require("./plugins/back");

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("✅ Bot is running..."));

app.post(`/webhook/${config.TELEGRAM_BOT_TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Set webhook on server start
app.listen(config.PORT, async () => {
    console.log(`✅ Server running on port ${config.PORT}`);

    const webhookUrl = `${config.RENDER_URL}/webhook/${config.TELEGRAM_BOT_TOKEN}`;
    try {
        await bot.setWebHook(webhookUrl);
        console.log(`✅ Webhook set: ${webhookUrl}`);
    } catch (error) {
        console.error("❌ Failed to set webhook:", error.message);
    }
});

// Store user state to prevent spam clicking
const userState = {};

// Function to check if user has joined all required channels
const hasJoinedAllChannels = async (userId) => {
    try {
        for (const channel of config.CHANNELS) {
            const response = await axios.get(
                `https://api.telegram.org/bot${config.TELEGRAM_BOT_TOKEN}/getChatMember`,
                { params: { chat_id: channel, user_id: userId } }
            );
            const status = response.data.result.status;
            if (status === "left" || status === "kicked") return false;
        }
        return true;
    } catch (error) {
        console.error("❌ Error checking user membership:", error.message);
        return false;
    }
};

// Handle incoming messages
bot.on("message", async (msg) => {
    try {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const text = msg.text; // Keep original case

        // Prevent spam clicking
        if (userState[userId]) return;

        // Set user as active
        userState[userId] = true;

        // Check if user has joined all channels
        const joined = await hasJoinedAllChannels(userId);

        if (text === "/start") {
            if (!joined) {
                await startCommand(bot, msg);
            } else {
                await mainCommand(bot, msg);
            }
        } else if (text === "/joined") {
            if (!joined) {
                await bot.sendMessage(chatId, "❌ You have not joined all required channels. Please join first.");
            } else {
                await joinedCommand(bot, msg);
            }
        } else if (text === "/check") {
            await checkCommand(bot, msg);
        } else if (text === "🔙 Back") { // Fixed case sensitivity
            await backCommand(bot, msg);
        } else if (text === "🗃 More") { // Fixed case sensitivity
            await main2Command(bot, msg);
        }

        // Reset user state after 2 seconds
        setTimeout(() => {
            delete userState[userId];
        }, 2000);
    } catch (error) {
        console.error("❌ Error handling message:", error.message);
    }
});

// Handle "✅ Joined" button clicks
bot.on("callback_query", async (callback) => {
    try {
        const userId = callback.from.id;
        const chatId = callback.message.chat.id;

        // Prevent spam clicking
        if (userState[userId]) return;

        // Set user as active
        userState[userId] = true;

        // Check if user has joined all channels
        const joined = await hasJoinedAllChannels(userId);

        if (!joined) {
            await bot.answerCallbackQuery(callback.id, {
                text: "❌ You have not joined all required channels. Please join first.",
                show_alert: true
            });
        } else {
            await bot.answerCallbackQuery(callback.id);
            await mainCommand(bot, callback.message);
        }

        // Reset user state after 2 seconds
        setTimeout(() => {
            delete userState[userId];
        }, 2000);
    } catch (error) {
        console.error("❌ Error handling callback query:", error.message);
    }
});

console.log("✅ Bot is running...");