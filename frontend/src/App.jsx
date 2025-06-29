import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import Register from "./components/Register";
import Login from "./components/Login";
import FlashcardReview from "./components/FlashcardReview";
import Quiz from "./components/Quiz";
import CourseList from "./components/CourseList";
import CourseDetail from "./components/CourseDetail";
import CourseSection from "./components/CourseSection";
import Recommend from "./components/Recommend";
import ProgressDashboard from "./components/ProgressDashboard";
import NotesDashboard from "./components/NotesDashboard";
import NoteEditor from "./components/NoteEditor";
import NoteViewer from "./components/NoteViewer";
import Tutor from "./components/Tutor";
import "./App.css";

// Helper to extract userId from JWT token
function getUserIdFromToken(token) {
  if (!token) return "";
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id || payload.sub || ""; // adapt this field to your backend's JWT
  } catch {
    return "";
  }
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const userId = getUserIdFromToken(token);

  if (!token) {
    return (
      <div className="auth-container">
        <Register onRegistered={() => {}} />
        <Login onLogin={t => setToken(t)} />
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="main-body">
          <Sidebar />
          <Routes>
            {/* Main dashboard/home */}
            <Route path="/" element={<MainContent />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/courses/:courseId/section/:sectionId" element={<CourseSection />} />
            <Route path="/notes" element={<NotesDashboard token={token} userId={userId} />} />
            <Route path="/notes/new" element={<NoteEditor token={token} userId={userId} />} />
            <Route path="/notes/:noteId" element={<NoteViewer token={token} userId={userId} />} />
            <Route path="/quiz" element={<Quiz token={token} userId={userId} />} />
            <Route path="/recommend" element={<Recommend token={token} userId={userId} />} />
            {/* Flashcards route */}
            <Route path="/flashcards" element={<FlashcardReview token={token} userId={userId} />} />
            <Route path="/progress" element={<ProgressDashboard token={token} userId={userId} />} />
            <Route path="/tutor" element={<Tutor userId={userId} />} />
            {/* Redirect all unknown routes to home */}            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            setToken(null);
          }}
          style={{
            position: "fixed",
            right: 10,
            top: 10,
            zIndex: 999
          }}
        >
          Logout
        </button>
      </div>
    </Router>
  );
}

export default App;