const TelegramBot = require("node-telegram-bot-api");
const config = require("./config");

const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });

// Load all command plugins
const fs = require("fs");
const path = require("path");

const pluginsPath = path.join(__dirname, "plugins");
fs.readdirSync(pluginsPath).forEach(file => {
  if (file.endsWith(".js")) {
    const command = require(`./plugins/${file}`);
    command(bot);
  }
});

console.log("🤖 Bot is running...");

