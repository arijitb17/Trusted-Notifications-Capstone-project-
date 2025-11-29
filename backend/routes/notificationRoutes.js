const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("eventId");

    return res.json(notifications);
  } catch (err) {
    console.error("Error in /api/notifications:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
