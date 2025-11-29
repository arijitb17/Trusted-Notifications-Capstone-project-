const NotificationEvent = require("../models/NotificationEvent");

async function isDuplicateMessage(messageId) {
  const existing = await NotificationEvent.findOne({ messageId });
  return !!existing;
}

module.exports = { isDuplicateMessage };
