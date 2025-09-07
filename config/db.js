const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        let connectionURI;
        if (process.env.APP_ENV === 'production') {
            connectionURI = process.env.MONGO_URI_PROD;
        } else {
            connectionURI = process.env.MONGO_URI;
        }

        await mongoose.connect(connectionURI); // Removed deprecated options
    } catch (err) {
        console.error("MongoDB Connection Error: ", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
