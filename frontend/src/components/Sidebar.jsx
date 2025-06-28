import { Link, useLocation } from "react-router-dom";
//import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();

  // Helper to apply an "active" class for the current page (optional, for styling)
  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <aside className="sidebar">
      <div className="user-profile">
        {/* Placeholder for user avatar */}
        <div className="avatar" />
        <div className="profile-label">User Profile</div>
      </div>
      <nav className="navigation">
        <ul>
          <li>
            <Link to="/" className={isActive("/")}>Home</Link>
          </li>
          <li>
            <Link to="/courses" className={isActive("/courses")}>Courses</Link>
          </li>
          <li>
            <Link to="/notes" className={isActive("/notes")}>Notes</Link>
          </li>
          <li>
            <Link to="/quiz" className={isActive("/quiz")}>Quiz</Link>
          </li>
          <li>
            <Link to="/recommend" className={isActive("/recommend")}>Recommend</Link>
          </li>
          <li>
            <Link to="/progress" className={isActive("/progress")}>Progress</Link>
          </li>
          <li>
            <Link to="/flashcards" className={isActive("/flashcards")}>Flashcards</Link>
          </li>
          <li>
            <Link to="/tutor" className={isActive("/tutor")}>Tutor</Link>
          </li>
          {/* <li>
            <Link to="/settings" className={isActive("/settings")}>Settings</Link>
          </li> */}

        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;