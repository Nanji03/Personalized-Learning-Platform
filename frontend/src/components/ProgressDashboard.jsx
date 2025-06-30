import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const METRICS = [
  { label: "Quiz Attempts", value: "quiz_attempts" },
  { label: "Flashcards Reviewed", value: "flashcards_reviewed" }
];

export default function ProgressDashboard({ token, userId }) {
  const [metric, setMetric] = useState(METRICS[0].value);
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setMsg("");
    fetch(`http://localhost:8000/progress?user_id=${userId}&metric=${metric}&days=14`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load progress.");
        return res.json();
      })
      .then(json => {
        setData(json.data);
        setSummary(json.summary || {});
      })
      .catch(() => setMsg("Could not load progress data."))
      .finally(() => setLoading(false));
  }, [userId, metric, token]);

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 4px 20px rgba(22,36,71,0.08)", padding: "2rem" }}>
      <h2 className="section-title">Your Progress</h2>
      <div style={{ marginBottom: 20 }}>
        <label>
          <span style={{ fontWeight: 600, color: "#162447" }}>Metric:&nbsp;</span>
          <select value={metric} onChange={e => setMetric(e.target.value)}>
            {METRICS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </label>
      </div>
      {summary && (
        <div style={{ marginBottom: 16, color: "#162447" }}>
          <b>Total:</b> {summary.total ?? 0} &nbsp; | &nbsp;
          <b>Average/Day:</b> {summary.average ?? 0}
        </div>
      )}
      {loading && <div>Loading progress...</div>}
      {msg && <div style={{ color: "red" }}>{msg}</div>}
      {!loading && !msg && (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 20, right: 40, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" name="Count" stroke="#162447" strokeWidth={3} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}