const mongoose = require("mongoose");

const NotificationEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: ["OTP", "HIGH_VALUE_DEBIT", "CARD_NOT_PRESENT", "SERVICE_REMINDER"],
      required: true,
    },
    userId: { type: String, required: true },
    payload: { type: Object, default: {} },
    criticality: {
      type: String,
      enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
      default: "MEDIUM",
    },
    messageId: { type: String, unique: true, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("NotificationEvent", NotificationEventSchema);
