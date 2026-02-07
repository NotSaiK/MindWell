const express = require("express");
const Journal = require("../models/Journal");
const Mood = require("../models/Mood");

const router = express.Router();

router.post("/export", async (req, res) => {
  const { userId } = req.body;

  const journals = await Journal.find({ userId });
  const moods = await Mood.find({ userId });

  res.json({
    journals,
    moods,
  });
});

module.exports = router;
