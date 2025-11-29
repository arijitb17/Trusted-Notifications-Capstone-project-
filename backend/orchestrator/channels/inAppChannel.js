async function sendInApp({ userId, title, body }) {
  console.log(`📥 [In-App] user=${userId} title=${title} body=${body}`);
  // In real app you'd store this in an in-app inbox collection
  return true;
}

module.exports = { sendInApp };
