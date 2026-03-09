const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

// ROUTES
const emergencyRoutes = require("./routes/emergencyRoutes");
const evidenceRoutes = require("./routes/evidenceRoutes");

const app = express();

// DATABASE
connectDB();

// MIDDLEWARE
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Women Safety Backend API Running");
});

// API ROUTES
app.use("/api/emergency", emergencyRoutes);
app.use("/api/evidence", evidenceRoutes);

// SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});