import React, { useEffect, useState } from "react";

export default function PreferencesForm({ apiBase, userId }) {
  const [channels, setChannels] = useState({
    sms: true,
    email: true,
    push: true,
    inApp: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${apiBase}/api/preferences/${userId}`);
        const data = await res.json();
        setChannels(data.channels);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [apiBase, userId]);

  const toggle = (key) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await fetch(`${apiBase}/api/preferences/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channels }),
      });
      alert("Preferences saved");
    } catch (err) {
      console.error(err);
      alert("Error saving preferences");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading preferences...</p>;

  return (
    <div>
      <h2>User Notification Preferences</h2>
      <p style={{ fontSize: 13, color: "#6b7280" }}>
        Demonstrates how the orchestrator respects per-user channel choices before routing an
        event. Turn off SMS/Email/PUSH and see how delivery changes.
      </p>
      <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
        {["sms", "email", "push", "inApp"].map((ch) => (
          <label key={ch} style={{ fontSize: 14 }}>
            <input
              type="checkbox"
              checked={channels[ch]}
              onChange={() => toggle(ch)}
              style={{ marginRight: 4 }}
            />
            {ch.toUpperCase()}
          </label>
        ))}
      </div>
      <button onClick={save} disabled={saving} style={{ marginTop: 10 }}>
        {saving ? "Saving..." : "Save Preferences"}
      </button>
    </div>
  );
}
