const mongoose = require("mongoose");

const connectionURI = process.env.MONGO_URI;
const MONGO_PRODUCTION_URI_PASS = ":R@w].h.>N)9'K7";
const password = encodeURIComponent(MONGO_PRODUCTION_URI_PASS);
const prodConnectionURI = `mongodb+srv://robinNcode:${password}@robinncodecluster.ylh4h.mongodb.net/?retryWrites=true&w=majority&appName=robinncodeCluster`;

const connectDB = async () => {
    try {
        await mongoose.connect(prodConnectionURI); // Removed deprecated options
        console.log("MongoDB Connected Successfully!");
    } catch (err) {
        console.error("MongoDB Connection Error: ", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
