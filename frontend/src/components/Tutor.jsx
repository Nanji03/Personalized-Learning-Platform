import React, { useState, useEffect } from "react";
import axios from "axios";

function Tutor() {
  const [prompt, setPrompt] = useState("");
  const [topic, setTopic] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [flashcards, setFlashcards] = useState({});
  const [showFlashcards, setShowFlashcards] = useState(false);

  <ul>
  {history.map((h) => (
    <li key={h.id}>
      <strong>Q:</strong> {h.prompt}<br/>
      <strong>A:</strong> {h.answer}
    </li>
  ))}
  </ul>

  // Replace with actual user ID from your auth/user context
  //const user_id = "your_user_id_here";

  // Fetch tutor history on mount
  useEffect(() => {
    if (user_id) {
      axios
        .get(`/tutor/history?user_id=${user_id}`)
        .then((res) => setHistory(res.data))
        .catch((err) => console.error("Failed to fetch history", err));
    }
  }, [user_id]);

  const handleAsk = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnswer(null);
    try {
      const res = await axios.post("/tutor/ask", {
        user_id,
        prompt,
        topic,
      });
      setAnswer(res.data.answer);
      // Optionally refresh history
      setHistory((prev) => [{ id: res.data.id, answer: res.data.answer }, ...prev]);
    } catch (err) {
      setAnswer("Error contacting tutor.");
    }
    setLoading(false);
  };

  const fetchFlashcards = () => {
    axios
      .get(`/tutor/flashcards/${user_id}`)
      .then((res) => setFlashcards(res.data))
      .catch((err) => console.error("Failed to fetch flashcards", err));
    setShowFlashcards(true);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Ask Tutor</h2>
      <form onSubmit={handleAsk} style={{ marginBottom: 20 }}>
        <div>
          <label>
            Topic:
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              style={{ marginLeft: 10 }}
            />
          </label>
        </div>
        <div style={{ marginTop: 10 }}>
          <label>
            Your Question:
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              style={{ marginLeft: 10, width: "80%" }}
            />
          </label>
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
          {loading ? "Asking..." : "Ask Tutor"}
        </button>
      </form>
      {answer && (
        <div style={{ padding: "10px 0" }}>
          <strong>AI Tutor Answer:</strong>
          <p>{answer}</p>
        </div>
      )}

      <h3>Previous Tutor Answers</h3>
      <ul>
        {history.map((h) => (
          <li key={h.id}>{h.answer}</li>
        ))}
      </ul>

      <button onClick={fetchFlashcards} style={{ marginTop: 20 }}>
        Show Flashcards by Topic
      </button>
      {showFlashcards && (
        <div>
          <h3>Flashcards</h3>
          {Object.keys(flashcards).length === 0 && <p>No flashcards found.</p>}
          {Object.entries(flashcards).map(([topic, cards]) => (
            <div key={topic}>
              <h4>{topic}</h4>
              <ul>
                {cards.map((card) => (
                  <li key={card._id}>
                    <strong>Q:</strong> {card.question} <br />
                    <strong>A:</strong> {card.answer}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Tutor;