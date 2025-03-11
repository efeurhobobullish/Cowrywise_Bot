module.exports = async (bot, msg) => {
    if (msg.text === "🔙 Back") {
        require("./main.js")(bot, msg);
    }
};
