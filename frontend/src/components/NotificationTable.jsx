import React, { useEffect, useState } from "react";

export default function NotificationTable({ apiBase }) {
  const [items, setItems] = useState([]);

  const load = async () => {
    try {
      const res = await fetch(`${apiBase}/api/notifications`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, [apiBase]);

  return (
    <div>
      <h2>Recent Notifications</h2>
      <p style={{ fontSize: 13, color: "#6b7280" }}>
        Each row corresponds to a channel attempt created by the orchestrator. Use this
        table during demo to show multi-channel routing, vendor choice and failover.
      </p>
      <div style={{ overflowX: "auto" }}>
        <table
          border="1"
          cellPadding="6"
          style={{ borderCollapse: "collapse", width: "100%", marginTop: 8 }}
        >
          <thead>
            <tr>
              <th>Event Type</th>
              <th>User</th>
              <th>Channel</th>
              <th>Status</th>
              <th>Vendor</th>
              <th>Attempts</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {items.map((n) => (
              <tr key={n._id}>
                <td>{n.eventId?.eventType}</td>
                <td>{n.eventId?.userId}</td>
                <td>{n.channel}</td>
                <td>{n.status}</td>
                <td>{n.vendor || "-"}</td>
                <td>{n.attemptCount}</td>
                <td>
                  {n.createdAt
                    ? new Date(n.createdAt).toLocaleTimeString()
                    : "-"}
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: 8 }}>
                  No notifications yet. Trigger an event above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
