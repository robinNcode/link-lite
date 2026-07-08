require("dotenv").config();
const path = require("path");
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const corsOptions = require("./config/corsConfig");

const urlRoutes = require("./routes/urlRoutes");
const { homeView } = require("./controllers/homeController");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

connectDB()
  .then(() => console.log(`${process.env.APP_ENV || "development"}: MongoDB Connected Successfully!`))
  .catch((err) => console.error("MongoDB Connection Error:", err.message));

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", homeView);
app.use("/api/url", urlRoutes);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;


