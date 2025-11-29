async function sendPush({ deviceId, title, body }) {
  console.log(`📲 [Push] device=${deviceId} title=${title} body=${body}`);
  const success = Math.random() > 0.1;
  if (!success) {
    throw new Error("Push error");
  }
  return true;
}

module.exports = { sendPush };
