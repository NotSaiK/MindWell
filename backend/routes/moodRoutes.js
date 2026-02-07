const express = require("express");
const Mood = require("../models/Mood");

const router = express.Router();

// Save mood
router.post("/save", async (req, res) => {
  const { userId, mood } = req.body;

  const entry = await Mood.create({
    userId,
    mood,
  });

  res.json(entry);
});

// Get mood history
router.post("/history", async (req, res) => {
  const { userId } = req.body;

  const moods = await Mood.find({ userId }).sort({ createdAt: 1 });

  res.json(moods);
});

module.exports = router;
