async function sendEmail({ to, subject, body, vendor }) {
  console.log(`📧 [Email via ${vendor}] to=${to} subject=${subject}`);
  const success = Math.random() > 0.1;
  if (!success) {
    throw new Error("Email vendor error");
  }
  return true;
}

module.exports = { sendEmail };
