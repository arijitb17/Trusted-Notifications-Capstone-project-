const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    channel: { type: String, enum: ["SMS", "EMAIL", "PUSH"], required: true },
    priority: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    healthStatus: {
      type: String,
      enum: ["HEALTHY", "DEGRADED", "DOWN"],
      default: "HEALTHY",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", VendorSchema);
