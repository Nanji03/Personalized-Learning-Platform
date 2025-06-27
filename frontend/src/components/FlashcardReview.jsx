import { useEffect, useState } from "react";

export default function FlashcardReview({ token, userId }) {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch flashcards and extract topics on mount or when userId changes
  useEffect(() => {
    if (!userId || !token) return;
    setLoading(true);
    fetch(`http://localhost:8000/tutor/flashcards/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const topicNames = Object.keys(data);
        setTopics(topicNames);
        setSelectedTopic(topicNames[0] || "");
        setFlashcards(topicNames[0] ? data[topicNames[0]] : []);
        setCurrentIdx(0);
        setShowAnswer(false);
        setMessage(topicNames.length ? "" : "No flashcards found.");
      })
      .catch(() => setMessage("Failed to load flashcards."))
      .finally(() => setLoading(false));
  }, [userId, token]);

  // Update flashcards when topic changes
  useEffect(() => {
    if (!selectedTopic || !userId || !token) return;
    setLoading(true);
    fetch(`http://localhost:8000/tutor/flashcards/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setFlashcards(data[selectedTopic] || []);
        setCurrentIdx(0);
        setShowAnswer(false);
        setMessage((data[selectedTopic] || []).length ? "" : "No flashcards for this topic.");
      })
      .catch(() => setMessage("Failed to load flashcards."))
      .finally(() => setLoading(false));
  }, [selectedTopic, userId, token]);

  const handleReview = (correct) => {
    const flashcard = flashcards[currentIdx];
    if (!flashcard) return;
    fetch("http://localhost:8000/flashcard/review", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: userId,
        flashcard_id: flashcard._id,
        correct
      })
    }).catch(() => {}); // Optionally handle errors
    setCurrentIdx(idx => idx + 1);
    setShowAnswer(false);
  };

  if (!token) return <div>Please log in to review flashcards.</div>;

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Flashcard Review</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div>
            <label>
              Topic:&nbsp;
              <select value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)}>
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </label>
          </div>
          <br />
          {message && <div>{message}</div>}
          {!message && flashcards.length > 0 && currentIdx < flashcards.length && (
            <div style={{ marginTop: 20 }}>
              <div>
                <strong>Q:</strong> {flashcards[currentIdx].question}
              </div>
              {showAnswer ? (
                <div style={{ margin: "1rem 0", color: "#0a0" }}>
                  <strong>A:</strong> {flashcards[currentIdx].answer}
                </div>
              ) : (
                <button style={{ margin: "1rem 0" }} onClick={() => setShowAnswer(true)}>Show Answer</button>
              )}
              <div>
                <button onClick={() => handleReview(true)} disabled={!showAnswer}>Easy</button>
                <button onClick={() => handleReview(false)} disabled={!showAnswer}>Hard</button>
              </div>
              <div style={{ marginTop: 10 }}>
                Card {currentIdx + 1} of {flashcards.length}
              </div>
            </div>
          )}
          {flashcards.length > 0 && currentIdx >= flashcards.length && (
            <div style={{ marginTop: 20, color: "#18a" }}>
              All flashcards reviewed for this topic!
            </div>
          )}
        </>
      )}
    </div>
  );
}