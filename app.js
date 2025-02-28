require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const cors = require("cors");
const corsOptions = require("./config/corsConfig");

// Application layer imports
const urlRoutes = require("./routes/urlRoutes");
const {homeView} = require("./controllers/homeController");

const app = express();

// Middleware
app.use(bodyParser.json());
// Cors setup
app.use(cors(corsOptions));


// Connect to MongoDB
connectDB().then(r => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error: ", err.message));

// Static folder setup
app.use(express.static('public'));

// Views setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Routes
app.get("/", homeView);

// API Routes
app.use("/api/url", urlRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


