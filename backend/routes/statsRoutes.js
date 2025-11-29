const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const NotificationEvent = require("../models/NotificationEvent");

router.get("/", async (req, res) => {
  try {
    const totalEvents = await NotificationEvent.countDocuments();
    const totalNotifications = await Notification.countDocuments();
    const sent = await Notification.countDocuments({ status: "SENT" });
    const failed = await Notification.countDocuments({ status: "FAILED" });

    const successRate = totalNotifications
      ? (sent / totalNotifications) * 100
      : 0;

    return res.json({
      totalEvents,
      totalNotifications,
      sent,
      failed,
      successRate: successRate.toFixed(2),
    });
  } catch (err) {
    console.error("Error in /api/stats:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
