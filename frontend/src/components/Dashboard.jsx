import React, { useEffect, useState } from "react";

export default function Dashboard({ apiBase }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${apiBase}/api/stats`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [apiBase]);

  if (loading) return <p>Loading stats...</p>;
  if (!stats) return <p>Could not load stats.</p>;

  return (
    <div>
      <h2>Monitoring & Reliability Overview</h2>
      <p style={{ fontSize: 13, color: "#6b7280" }}>
        Quick view of notification throughput and success rate. Use this to detect vendor issues
        or routing problems in real time.
      </p>
      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          marginTop: 12,
        }}
      >
        <StatCard label="Total Events" value={stats.totalEvents} />
        <StatCard label="Total Notifications" value={stats.totalNotifications} />
        <StatCard label="Sent" value={stats.sent} />
        <StatCard label="Failed" value={stats.failed} />
        <StatCard label="Success Rate (%)" value={stats.successRate} />
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        borderRadius: 10,
        border: "1px solid #e5e7eb",
        padding: 12,
        minWidth: 140,
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280" }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600 }}>{value}</div>
    </div>
  );
}
