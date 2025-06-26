import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const METRICS = [
  { label: "Quiz Attempts", value: "quiz_attempts" },
  { label: "Flashcards Reviewed", value: "flashcards_reviewed" }
];

export default function ProgressDashboard({ token, userId }) {
  const [metric, setMetric] = useState(METRICS[0].value);
  const [data, setData] = useState([]);
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
      .then(json => setData(json.data))
      .catch(() => setMsg("Could not load progress data."))
      .finally(() => setLoading(false));
  }, [userId, metric, token]);

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h2>Your Progress</h2>
      <div>
        <label>
          Metric:&nbsp;
          <select value={metric} onChange={e => setMetric(e.target.value)}>
            {METRICS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </label>
      </div>
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
            <Line type="monotone" dataKey="value" name="Count" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}