import React, { useState } from "react";

export default function TriggerEventForm({ apiBase, userId }) {
  const [eventType, setEventType] = useState("OTP");
  const [otp, setOtp] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    const body = {
      eventType,
      userId,
      messageId: `${eventType}-${Date.now()}`,
      payload: {
        otp,
        phone: "+911234567890",
        email: "user@example.com",
      },
    };

    try {
      const res = await fetch(`${apiBase}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setResult(JSON.stringify(data));
    } catch (err) {
      console.error(err);
      setResult("Error triggering event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Trigger Test Event</h2>
      <p style={{ fontSize: 13, color: "#6b7280" }}>
        Use this form as a demo producer. It calls the unified event router endpoint and lets
        the backend orchestrator decide channels, vendors and retries.
      </p>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}
      >
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        >
          <option value="OTP">OTP</option>
          <option value="HIGH_VALUE_DEBIT">High-Value Debit</option>
          <option value="CARD_NOT_PRESENT">Card Not Present</option>
          <option value="SERVICE_REMINDER">Service Reminder</option>
        </select>

        {eventType === "OTP" && (
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="OTP code"
          />
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Event"}
        </button>
      </form>
      {result && (
        <small style={{ display: "block", marginTop: 6 }}>
          Response: {result}
        </small>
      )}
    </div>
  );
}
