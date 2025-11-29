async function sendSMS({ to, body, vendor }) {
  console.log(`📨 [SMS via ${vendor}] to=${to} body=${body}`);
  const success = Math.random() > 0.2;
  if (!success) {
    throw new Error("SMS vendor error");
  }
  return true;
}

module.exports = { sendSMS };
