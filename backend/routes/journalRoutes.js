const express = require("express");
const Journal = require("../models/Journal");
const { encryptText, decryptText } = require("../utils/encryption");

const router = express.Router();

// Create journal entry
router.post("/create", async (req, res) => {
  const { userId, text, secret } = req.body;

  const encrypted = encryptText(text, secret);

  const entry = await Journal.create({
    userId,
    encryptedText: encrypted,
  });

  res.json({ message: "Journal saved securely", entry });
});

// Get all journal entries
router.post("/get", async (req, res) => {
  const { userId, secret } = req.body;

  const entries = await Journal.find({ userId });

  const decryptedEntries = entries.map((e) => ({
    id: e._id,
    text: decryptText(e.encryptedText, secret),
    createdAt: e.createdAt,
  }));

  res.json(decryptedEntries);
});

module.exports = router;
