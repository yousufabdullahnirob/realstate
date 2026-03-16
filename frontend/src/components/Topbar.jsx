import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const [search, setSearch] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const notificationCount = 3;

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!profileRef.current?.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    navigate('/');
  };

  const goToDashboard = () => {
    setIsProfileOpen(false);
    navigate('/admin');
  };

  const goToNotifications = () => {
    setIsProfileOpen(false);
    navigate('/admin/notifications');
  };

  return (
    <div className="topbar">
      <div className="topbar-search">
        <span className="search-icon" aria-hidden="true">🔎</span>
        <input 
          type="text" 
          placeholder="Search projects, apartments..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="topbar-right">
        <button
          type="button"
          className="notif-btn"
          aria-label="Notifications"
          onClick={() => navigate('/admin/notifications')}
        >
          <span aria-hidden="true">🔔</span>
          <span className="badge">{notificationCount}</span>
        </button>
        <div className="profile-wrap" ref={profileRef}>
          <button
            type="button"
            className="profile-menu"
            aria-label="Profile menu"
            aria-expanded={isProfileOpen}
            onClick={() => setIsProfileOpen((previous) => !previous)}
          >
            <div className="avatar" aria-hidden="true">A</div>
            <div className="profile-text">
              <span className="profile-name">Admin</span>
              <span className="profile-role">Administrator</span>
            </div>
            <i className="dropdown-icon" aria-hidden="true">▼</i>
          </button>

          {isProfileOpen && (
            <div className="profile-dropdown" role="menu" aria-label="Profile options">
              <button type="button" className="profile-option" onClick={goToDashboard}>Dashboard</button>
              <button type="button" className="profile-option" onClick={goToNotifications}>Notifications</button>
              <button type="button" className="profile-option danger" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
        <button type="button" className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Topbar;

