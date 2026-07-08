const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        let connectionURI;
        if (process.env.APP_ENV === 'production') {
            connectionURI = process.env.MONGO_URI_PROD;
        } else {
            connectionURI = process.env.MONGO_URI;
        }

        if (!connectionURI) {
            throw new Error("MongoDB connection string is not configured.");
        }

        await mongoose.connect(connectionURI);
        return true;
    } catch (err) {
        console.warn("MongoDB unavailable, continuing with in-memory URL storage:", err.message);
        return false;
    }
};

module.exports = connectDB;
