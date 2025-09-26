const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const ticketRoutes = require("./routes/tickets"); 
const botRoutes = require("./routes/bot")

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/bot", botRoutes);

// Test route
app.get("/", (req, res) => res.send("Server is running"));

module.exports = app; 
