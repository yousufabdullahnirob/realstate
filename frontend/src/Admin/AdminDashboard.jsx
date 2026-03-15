import React from "react";
import "./admin.css";
import logo from "../../images/logo.svg"; // Adjust path based on your folder structure

const AdminDashboard = () => {
  return (
    <div className="admin-container">

      {/* SIDEBAR */}
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

      {/* MAIN AREA */}
      <div className="main">

        {/* HEADER */}
        <header className="admin-header">
          <div className="header-left">
            <h3>Dashboard Overview</h3>
          </div>

          <div className="header-right">
            <span>Admin</span>
            <div className="admin-avatar"></div>
          </div>
        </header>

        <div className="dashboard-container">

          {/* KPI STATS */}
          <section className="stats">
            <div className="stat-card">
              <h4>Total Projects</h4>
              <p>12</p>
            </div>

            <div className="stat-card">
              <h4>Total Apartments</h4>
              <p>84</p>
            </div>

            <div className="stat-card">
              <h4>Available Units</h4>
              <p>36</p>
            </div>

            <div className="stat-card">
              <h4>Booked Units</h4>
              <p>48</p>
            </div>
          </section>

          {/* PROJECT PREVIEW */}
          <section className="preview-section">
            <div className="section-header">
              <h3>Recent Projects</h3>
              <a href="/project-admin" className="manage-btn">Manage</a>
            </div>

            <div className="preview-gallery">
              {["Green Valley Residence", "Lake View Towers", "Skyline Heights"].map((project, index) => (
                <div className="gallery-tile" key={index}>
                  <div className="gallery-img"></div>
                  <div className="gallery-info">
                    <h4>{project}</h4>
                    <p>{["Dhaka", "Gulshan", "Banani"][index]}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* APARTMENT PREVIEW */}
          <section className="preview-section">
            <div className="section-header">
              <h3>Recent Apartments</h3>
              <a href="/apartment-admin" className="manage-btn">Manage</a>
            </div>

            <div className="preview-gallery">
              {[
                { name: "Apartment A1", project: "Green Valley Residence" },
                { name: "Apartment B3", project: "Lake View Towers" },
                { name: "Apartment C2", project: "Skyline Heights" },
              ].map((apt, index) => (
                <div className="gallery-tile" key={index}>
                  <div className="gallery-img"></div>
                  <div className="gallery-info">
                    <h4>{apt.name}</h4>
                    <p>{apt.project}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;