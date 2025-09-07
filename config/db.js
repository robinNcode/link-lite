const { getDbUrl } = require("./common");
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        let connectionURI = getDbUrl();
        await mongoose.connect(connectionURI); // Removed deprecated options
    } catch (err) {
        console.error("MongoDB Connection Error: ", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
