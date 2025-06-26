function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="user-profile">
        {/* Placeholder for user avatar */}
        <div className="avatar" />
        <div className="profile-label">User Profile</div>
      </div>
      <nav className="navigation">
        {/* Add your navigation links here */}
        <ul>
          <li>Home</li>
          <li>Courses</li>
          <li>Progress</li>
          <li>Settings</li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;