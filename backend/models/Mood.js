const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    mood: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mood", moodSchema);
