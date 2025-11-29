const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "NotificationEvent", required: true },
    channel: {
      type: String,
      enum: ["SMS", "EMAIL", "PUSH", "IN_APP"],
      required: true,
    },
    vendor: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "SENT", "FAILED"],
      default: "PENDING",
    },
    attemptCount: { type: Number, default: 0 },
    lastError: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
