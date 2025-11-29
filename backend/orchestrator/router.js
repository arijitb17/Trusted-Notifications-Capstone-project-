const Notification = require("../models/Notification");
const UserPreference = require("../models/UserPreference");
const Template = require("../models/Template");
const Vendor = require("../models/Vendor");
const { sendSMS } = require("./channels/smsChannel");
const { sendEmail } = require("./channels/emailChannel");
const { sendPush } = require("./channels/pushChannel");
const { sendInApp } = require("./channels/inAppChannel");
const { signPayload } = require("../utils/signer");

const ROUTING_MATRIX = {
  OTP: ["SMS", "PUSH", "EMAIL"],
  HIGH_VALUE_DEBIT: ["PUSH", "SMS", "EMAIL"],
  CARD_NOT_PRESENT: ["PUSH", "SMS"],
  SERVICE_REMINDER: ["PUSH", "IN_APP"],
};

async function processEvent(eventDoc) {
  const { eventType, userId, payload } = eventDoc;
  const preferredChannels = ROUTING_MATRIX[eventType] || ["SMS"];

  const prefs =
    (await UserPreference.findOne({ userId })) ||
    new UserPreference({ userId });

  const enabledChannels = preferredChannels.filter((ch) => {
    const key = ch.toLowerCase().replace("-", "");
    return prefs.channels[key] !== false;
  });

  for (const channel of enabledChannels) {
    const notification = await Notification.create({
      eventId: eventDoc._id,
      channel,
      status: "PENDING",
    });

    try {
      await dispatchToChannel(channel, eventDoc, notification);
      notification.status = "SENT";
      await notification.save();
      break;
    } catch (err) {
      console.error(`❌ Failed on channel ${channel}:`, err.message);
      notification.status = "FAILED";
      notification.lastError = err.message;
      notification.attemptCount += 1;
      await notification.save();
    }
  }
}

async function dispatchToChannel(channel, eventDoc, notification) {
  const { eventType, userId, payload } = eventDoc;

  const templateCode = `${eventType}_${channel}`;
  const template = await Template.findOne({
    code: templateCode,
    channel,
    isApproved: true,
  });

  const bodyText = template
    ? template.body.replace("{{code}}", payload.otp || "")
    : JSON.stringify(payload);

  const signedPayload = {
    userId,
    eventType,
    channel,
    payload,
    ts: Date.now(),
  };
  const signature = signPayload(signedPayload);

  if (channel === "SMS") {
    const vendors = await Vendor.find({
      channel: "SMS",
      isActive: true,
    }).sort("priority");
    let lastError;
    if (!vendors.length) {
      throw new Error("No SMS vendors configured");
    }
    for (const v of vendors) {
      try {
        await sendSMS({ to: payload.phone, body: bodyText, vendor: v.name });
        notification.vendor = v.name;
        return;
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError || new Error("All SMS vendors failed");
  }

  if (channel === "EMAIL") {
    await sendEmail({
      to: payload.email,
      subject: "Notification",
      body: bodyText + `\n\nSignature: ${signature}`,
      vendor: "DemoEmailVendor",
    });
    notification.vendor = "DemoEmailVendor";
    return;
  }

  if (channel === "PUSH") {
    await sendPush({
      deviceId: payload.deviceId || "demo-device",
      title: eventType,
      body: bodyText,
    });
    notification.vendor = "DemoPush";
    return;
  }

  if (channel === "IN_APP") {
    await sendInApp({
      userId,
      title: eventType,
      body: bodyText,
    });
    notification.vendor = "InAppInbox";
    return;
  }

  throw new Error(`Unknown channel: ${channel}`);
}

module.exports = { processEvent };
