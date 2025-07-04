import React from "react";

function MainContent() {
  return (
    <main className="main-content">
      <h1>Welcome to the Personalized Learning System</h1>
      <p style={{ fontSize: "1.1rem", marginBottom: "2rem", maxWidth: 700 }}>
        Your all-in-one platform to accelerate your learning with personalized tools. Track your progress, take quizzes, manage notes, review flashcards, and get AI-powered tutoring—all in one place.
      </p>
      <h2>What can you do here?</h2>
      <ol style={{ lineHeight: 2, fontSize: "1.07rem", maxWidth: 700 }}>
        <li>
          <strong>Home:</strong> This page! See an overview and get started.
        </li>
        <li>
          <strong>Courses:</strong> Browse available courses and dive into their sections and materials.
        </li>
        <li>
          <strong>Notes:</strong> Create, organize, and review your learning notes.
        </li>
        <li>
          <strong>Quiz:</strong> Generate and take quizzes on topics you’re studying to test your knowledge.
        </li>
        <li>
          <strong>Recommend:</strong> Get personalized recommendations for what to study next based on your progress.
        </li>
        <li>
          <strong>Progress:</strong> Visualize your learning journey with charts and statistics.
        </li>
        <li>
          <strong>Flashcards:</strong> Review and practice using smart flashcards on various topics.
        </li>
        <li>
          <strong>Tutor:</strong> Ask our AI Tutor questions and get instant, helpful answers.
        </li>
      </ol>
      <div style={{ marginTop: "2.5rem", color: "#555", fontSize: "1.03rem" }}>
         Ready to get started? Use the sidebar to explore each feature at your own pace!
      </div>
    </main>
  );
}

export default MainContent;