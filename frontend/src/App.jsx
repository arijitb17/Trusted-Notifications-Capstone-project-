import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import TriggerEventForm from "./components/TriggerEventForm";
import NotificationTable from "./components/NotificationTable";
import PreferencesForm from "./components/PreferencesForm";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function App() {
  const [userId, setUserId] = useState("user-123");

  return (
    <div className="container">
      <div className="card">
        <h1>Trusted Notifications Orchestrator</h1>
        <p style={{ color: "#4b5563", maxWidth: 700 }}>
          A unified router to send reliable, safe and timely digital notifications for
          OTP, high-value transactions, card-not-present events and service reminders.
        </p>
        <div style={{ marginTop: 8 }}>
          <label style={{ fontSize: 14, marginRight: 8 }}>Current User ID:</label>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ minWidth: 160 }}
          />
        </div>
      </div>

      <div className="card">
        <Dashboard apiBase={API_BASE} />
      </div>

      <div className="card">
        <TriggerEventForm apiBase={API_BASE} userId={userId} />
      </div>

      <div className="card">
        <PreferencesForm apiBase={API_BASE} userId={userId} />
      </div>

      <div className="card">
        <NotificationTable apiBase={API_BASE} />
      </div>
    </div>
  );
}
