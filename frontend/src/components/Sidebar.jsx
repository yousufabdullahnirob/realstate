import React from "react";
import logo from "../images/logo.svg"; // adjust path if needed

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo">
        <img src={logo} alt="Company Logo" />
        <div className="logo-text">Mahim Builders</div>
      </div>

      <nav className="sidebar-nav">
        <a className="active" href="/admin-dashboard">📊 Dashboard</a>
        <a href="/project-admin">🏗 Projects</a>
        <a href="/apartment-admin">🏢 Apartments</a>
        <a href="#">📅 Bookings</a>
        <a href="#">👤 Users</a>
      </nav>
    </aside>
  );
};

export default Sidebar;