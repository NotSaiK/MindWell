const moodRoutes = require("./routes/moodRoutes");
const express = require("express");
const exportRoutes = require("./routes/exportRoutes");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const journalRoutes = require("./routes/journalRoutes");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/journal", journalRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/export", exportRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("MindWell backend running");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
