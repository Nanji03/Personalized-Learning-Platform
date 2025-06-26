import { useState } from "react";

const skillLevels = ["Beginner", "Intermediate", "Advanced"];

export default function Quiz({ token, userId }) {
  // Quiz setup state
  const [topic, setTopic] = useState("");
  const [skillLevel, setSkillLevel] = useState(skillLevels[0]);
  const [learningObjective, setLearningObjective] = useState("");
  const [numQuestions, setNumQuestions] = useState(3);
  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [quizId, setQuizId] = useState(null);

  // Start Quiz
  async function startQuiz(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setQuestions([]);
    setCurrent(0);
    setAnswers([]);
    setShowResults(false);
    try {
      const res = await fetch("http://localhost:8000/quiz/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: userId,
          topic,
          skill_level: skillLevel,
          learning_objective: learningObjective,
          number_of_questions: numQuestions
        })
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Failed to generate quiz");
      const data = await res.json();
      setQuestions(data);
      setQuizId(Math.random().toString(36).substring(2)); // client-generated id for this attempt
    } catch (err) {
      setMsg("Quiz generation failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // Handle answer selection
  function selectAnswer(option) {
    setAnswers(a => {
      const newAnswers = [...a];
      newAnswers[current] = option;
      return newAnswers;
    });
  }

  // Next question or finish
  function next() {
    if (current < questions.length - 1) {
      setCurrent(cur => cur + 1);
    } else {
      setShowResults(true);
      recordAttempt();
    }
  }

  // Record attempt to backend
  async function recordAttempt() {
    const score = questions.reduce(
      (acc, q, idx) => acc + ((answers[idx] || "") === q.correct_answer ? 1 : 0),
      0
    );
    if (!quizId) return;
    try {
      await fetch("http://localhost:8000/quiz/attempt", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: userId,
          quiz_id: quizId,
          score
        })
      });
    } catch (err) {
      // Optionally handle/report error
    }
  }

  // Reset for another quiz
  function resetQuiz() {
    setQuestions([]);
    setAnswers([]);
    setCurrent(0);
    setShowResults(false);
    setMsg("");
    setQuizId(null);
  }

  // Quiz setup form
  if (!questions.length) {
    return (
      <form className="quiz-setup" onSubmit={startQuiz} style={{ maxWidth: 400, margin: "2rem auto" }}>
        <h2>Start a Quiz</h2>
        <div>
          <label>Topic: <input required value={topic} onChange={e => setTopic(e.target.value)} /></label>
        </div>
        <div>
          <label>Skill Level:&nbsp;
            <select value={skillLevel} onChange={e => setSkillLevel(e.target.value)}>
              {skillLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
            </select>
          </label>
        </div>
        <div>
          <label>Learning Objective:<br />
            <input required value={learningObjective} onChange={e => setLearningObjective(e.target.value)} />
          </label>
        </div>
        <div>
          <label>Number of Questions:&nbsp;
            <input type="number" min={1} max={10} value={numQuestions} onChange={e => setNumQuestions(Number(e.target.value))} />
          </label>
        </div>
        <div>
          <button type="submit" disabled={loading}>{loading ? "Generating..." : "Start Quiz"}</button>
        </div>
        {msg && <div style={{ color: "red" }}>{msg}</div>}
      </form>
    );
  }

  // Quiz results
  if (showResults) {
    const score = questions.reduce(
      (acc, q, idx) => acc + ((answers[idx] || "") === q.correct_answer ? 1 : 0),
      0
    );
    return (
      <div className="quiz-results" style={{ maxWidth: 500, margin: "2rem auto" }}>
        <h2>Quiz Results</h2>
        <div>Your score: {score} / {questions.length}</div>
        <ol>
          {questions.map((q, idx) => (
            <li key={idx} style={{ marginBottom: 16 }}>
              <div><b>{q.question}</b></div>
              <div>
                Correct Answer: <b>{q.correct_answer}) {q.options["ABCD".indexOf(q.correct_answer)]}</b>
                {answers[idx] && answers[idx] !== q.correct_answer && (
                  <span style={{ color: "red" }}> (Your answer: {answers[idx]})</span>
                )}
              </div>
              <div style={{ color: "#080" }}>Explanation: {q.explanation}</div>
            </li>
          ))}
        </ol>
        <button onClick={resetQuiz}>Take Another Quiz</button>
      </div>
    );
  }

  // Quiz question UI
  const q = questions[current];
  return (
    <div className="quiz" style={{ maxWidth: 500, margin: "2rem auto" }}>
      <div>
        <b>Topic:</b> {topic} &nbsp; <b>Skill:</b> {skillLevel}
      </div>
      <div>Question {current + 1} of {questions.length}</div>
      <div style={{ margin: "1rem 0" }}>
        <b>{q.question}</b>
      </div>
      <div>
        {q.options.map((opt, idx) => {
          const letter = "ABCD"[idx];
          return (
            <div key={letter} style={{ marginBottom: 4 }}>
              <label>
                <input
                  type="radio"
                  name="answer"
                  value={letter}
                  checked={answers[current] === letter}
                  onChange={() => selectAnswer(letter)}
                />
                &nbsp;<b>{letter})</b> {opt}
              </label>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 10 }}>
        <button
          onClick={next}
          disabled={typeof answers[current] === "undefined"}
        >
          {current === questions.length - 1 ? "Finish Quiz" : "Next"}
        </button>
      </div>
    </div>
  );
}