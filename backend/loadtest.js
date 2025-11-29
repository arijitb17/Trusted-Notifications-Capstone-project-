// Node 18+ built-in fetch — no imports needed

const TOTAL = 5000;

// Available event types
const EVENT_TYPES = [
  "OTP",
  "HIGH_VALUE_DEBIT",
  "CARD_NOT_PRESENT",
  "SERVICE_REMINDER"
];

// Payload generator for each type
function generatePayload(type, i) {
  switch (type) {
    case "OTP":
      return {
        otp: Math.floor(100000 + Math.random() * 900000).toString(),
        phone: "+911234567890",
        email: "test@example.com"
      };

    case "HIGH_VALUE_DEBIT":
      return {
        amount: (Math.random() * 10000 + 1000).toFixed(2),
        merchant: "Amazon India",
        account: "XXXX" + (1000 + i % 9000)
      };

    case "CARD_NOT_PRESENT":
      return {
        card: "XXXX-XXXX-XXXX-" + (1000 + (i % 9000)),
        merchant: "Flipkart",
        amount: (Math.random() * 5000 + 500).toFixed(2),
        location: "Online"
      };

    case "SERVICE_REMINDER":
      return {
        description: "Your statement is ready",
        dueDate: "2025-12-01",
        account: "XXXX1234"
      };

    default:
      return {};
  }
}

// Send one request
async function sendRequest(i) {
  const randomType = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];

  const body = {
    eventType: randomType,
    userId: "loadtest-user",
    messageId: `${randomType}-${i}`, // idempotency safe
    payload: generatePayload(randomType, i)
  };

  try {
    const res = await fetch("http://localhost:5000/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    console.log(`[${i}] Sent: ${randomType}`, "→", data.message || data);
  } catch (err) {
    console.log(`Error at ${i}:`, err.message);
  }
}

// Master runner
async function start() {
  console.log("🔥 Sending 5000 mixed event types...");

  for (let i = 1; i <= TOTAL; i++) {
    sendRequest(i);
    await new Promise(r => setTimeout(r, 3)); // prevent overload
  }

  console.log("✅ Finished load test.");
}

start();
