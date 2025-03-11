const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Database connected successfully!");
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        process.exit(1); // Exit process if database connection fails
    }
};

module.exports = connectDB;