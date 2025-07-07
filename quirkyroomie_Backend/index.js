// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/auth.routes.js");
const complaintRoutes = require("./routes/complaint.routes.js");
const statsRoutes = require("./routes/stats.routes.js");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/flat", statsRoutes);


// Base test route
app.get("/", (req, res) => {
  res.send("QuirkyRoomie Backend is Running ");
});


// DB connection
connectDB().then(() => {
    console.log(" MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error(" MongoDB connection error:", err));
