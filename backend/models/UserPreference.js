const mongoose = require("mongoose");

const UserPreferenceSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true, required: true },
    channels: {
      sms: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPreference", UserPreferenceSchema);
