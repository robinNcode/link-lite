require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const urlRoutes = require("./routes/urlRoutes");

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
connectDB().then(r => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error: ", err.message));

// Routes
app.use("/api/url", urlRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


