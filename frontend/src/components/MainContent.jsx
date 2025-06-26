import React, { useState } from "react";

const DEMO_QUESTIONS = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correct_answer: "Paris"
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "2"],
    correct_answer: "4"
  }
];

function MainContent() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const current = DEMO_QUESTIONS[idx];

  function handleOption(option) {
    setSelected(option);
    setShowAnswer(true);
  }

  function next() {
    setSelected(null);
    setShowAnswer(false);
    setIdx((i) => (i + 1) % DEMO_QUESTIONS.length);
  }

  return (
    <main className="main-content">
      <h2 style={{ marginBottom: 16 }}>{current.question}</h2>
      <div style={{ width: "100%" }}>
        {current.options.map(option => (
          <button
            key={option}
            onClick={() => handleOption(option)}
            disabled={showAnswer}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "var(--radius, 8px)",
              border: "none",
              background: selected === option
                ? (option === current.correct_answer ? "var(--accent, #A3E635)" : "var(--danger, #F87171)")
                : "var(--primary, #E0E7FF)",
              color: "#181818",
              fontWeight: 600,
              cursor: showAnswer ? "not-allowed" : "pointer",
              opacity: showAnswer && selected !== option ? 0.6 : 1,
              transition: "background 0.2s, color 0.2s"
            }}
          >
            {option}
          </button>
        ))}
      </div>
      {showAnswer && (
        <div style={{ marginTop: 20, color: selected === current.correct_answer ? "var(--accent, #A3E635)" : "var(--danger, #F87171)" }}>
          {selected === current.correct_answer ? "Correct!" : `Incorrect. Correct answer: ${current.correct_answer}`}
        </div>
      )}
      {showAnswer && (
        <button
          onClick={next}
          style={{
            marginTop: 28,
            padding: "10px 28px",
            borderRadius: "var(--radius, 8px)",
            border: "none",
            background: "var(--primary, #E0E7FF)",
            color: "#181818",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          Next
        </button>
      )}
    </main>
  );
}

export default MainContent;