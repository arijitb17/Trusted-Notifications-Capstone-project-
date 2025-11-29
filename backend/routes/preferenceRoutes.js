const express = require("express");
const router = express.Router();
const UserPreference = require("../models/UserPreference");

router.get("/:userId", async (req, res) => {
  try {
    const prefs =
      (await UserPreference.findOne({ userId: req.params.userId })) ||
      new UserPreference({ userId: req.params.userId });

    return res.json(prefs);
  } catch (err) {
    console.error("Error in GET /api/preferences:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:userId", async (req, res) => {
  try {
    const { sms, email, push, inApp } = req.body.channels || {};
    const prefs = await UserPreference.findOneAndUpdate(
      { userId: req.params.userId },
      {
        userId: req.params.userId,
        channels: { sms, email, push, inApp },
      },
      { upsert: true, new: true }
    );
    return res.json(prefs);
  } catch (err) {
    console.error("Error in POST /api/preferences:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
