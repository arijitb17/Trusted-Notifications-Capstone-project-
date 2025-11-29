const express = require("express");
const router = express.Router();
const NotificationEvent = require("../models/NotificationEvent");
const { isDuplicateMessage } = require("../utils/idempotency");
const { processEvent } = require("../orchestrator/router");

router.post("/", async (req, res) => {
  try {
    const { eventType, userId, payload, messageId, criticality } = req.body;

    if (!eventType || !userId || !messageId) {
      return res
        .status(400)
        .json({ error: "eventType, userId, messageId are required" });
    }

    if (await isDuplicateMessage(messageId)) {
      return res
        .status(200)
        .json({ message: "Duplicate message ignored (idempotent)" });
    }

    const eventDoc = await NotificationEvent.create({
      eventType,
      userId,
      payload,
      messageId,
      criticality: criticality || "CRITICAL",
    });

    processEvent(eventDoc);

    return res
      .status(202)
      .json({ message: "Event accepted", eventId: eventDoc._id });
  } catch (err) {
    console.error("Error in /api/events:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
