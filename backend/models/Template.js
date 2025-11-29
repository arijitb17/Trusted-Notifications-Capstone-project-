const mongoose = require("mongoose");

const TemplateSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true },
    channel: { type: String, enum: ["SMS", "EMAIL", "PUSH", "IN_APP"], required: true },
    body: { type: String, required: true },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Template", TemplateSchema);
