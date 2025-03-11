module.exports = async (bot, msg) => {
    if (msg.text === "🔙 back") {
        require("./main.js")(bot, msg);
    }
};
