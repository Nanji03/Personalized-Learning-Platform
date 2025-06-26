import { useState } from "react";

export default function Recommend({ token, userId }) {
  const [userDoubt, setUserDoubt] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [preferredFormat, setPreferredFormat] = useState("video + article");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRecommendation(null);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/recommend/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({
          user_id: userId,
          user_doubt: userDoubt,
          preferred_format: preferredFormat,
          difficulty,
          context: context || undefined,
        })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Recommendation failed");
      }
      const data = await res.json();
      setRecommendation(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Get Learning Resource Recommendations</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            What are you struggling with?<br />
            <input
              type="text"
              required
              value={userDoubt}
              onChange={e => setUserDoubt(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Preferred Format:&nbsp;
            <select value={preferredFormat} onChange={e => setPreferredFormat(e.target.value)}>
              <option value="video + article">Video + Article</option>
              <option value="video">Video Only</option>
              <option value="article">Article Only</option>
            </select>
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Difficulty:&nbsp;
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            (Optional) Give us some context:<br />
            <input
              type="text"
              value={context}
              onChange={e => setContext(e.target.value)}
              style={{ width: "100%" }}
            />
          </label>
        </div>
        <button type="submit" disabled={loading || !userDoubt}>
          {loading ? "Loading..." : "Get Recommendations"}
        </button>
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {recommendation && (
        <div>
          <h3>Recommended Video</h3>
          <b>{recommendation.video_recommendation.title}</b><br />
          <a href={recommendation.video_recommendation.url} target="_blank" rel="noopener noreferrer">
            {recommendation.video_recommendation.url}
          </a>
          <div>{recommendation.video_recommendation.summary}</div>
          <div style={{ color: "#080" }}>{recommendation.video_recommendation.why_helpful}</div>
          <hr />
          <h3>Recommended Article</h3>
          <b>{recommendation.article_recommendation.title}</b><br />
          <a href={recommendation.article_recommendation.url} target="_blank" rel="noopener noreferrer">
            {recommendation.article_recommendation.url}
          </a>
          <div>{recommendation.article_recommendation.summary}</div>
          <div style={{ color: "#080" }}>{recommendation.article_recommendation.why_helpful}</div>
        </div>
      )}
    </div>
  );
}