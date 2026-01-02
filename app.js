const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Routes
const authRoutes = require("./routes/auth");
const victimRoutes = require("./routes/victim");
const volunteerRoutes = require("./routes/volunteer");
const adminRoutes = require("./routes/admin");

const { authenticateJWT } = require("./middleware/authMiddleware");


dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cookieParser());


require("./config/db")();


app.use("/auth", authRoutes);
app.use("/victim", authenticateJWT, victimRoutes);
app.use("/volunteer", authenticateJWT, volunteerRoutes);
app.use("/admin", authenticateJWT, adminRoutes);


app.get("/", (req, res) => {
  res.render("index");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
