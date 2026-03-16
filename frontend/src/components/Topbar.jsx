import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const resolveSearchRoute = (value) => {
    const query = value.trim().toLowerCase();

    if (!query) {
      return '/admin';
    }

    if (query.includes('project')) {
      return '/admin/projects';
    }
    if (query.includes('apartment') || query.includes('unit')) {
      return '/admin/apartments';
    }
    if (query.includes('book') || query.includes('reservation')) {
      return '/admin/bookings';
    }
    if (query.includes('payment') || query.includes('invoice')) {
      return '/admin/payments';
    }
    if (query.includes('inquir') || query.includes('message')) {
      return '/admin/inquiries';
    }
    if (query.includes('notif') || query.includes('alert')) {
      return '/admin/notifications';
    }

    return '/admin/projects';
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(resolveSearchRoute(search));
  };

  const handleNotificationsClick = () => {
    navigate('/admin/notifications');
  };

  const handleProfileClick = () => {
    navigate('/admin/users');
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="topbar">
      <div className="topbar-search">
        <form onSubmit={handleSearchSubmit} className="topbar-search-form">
          <input 
            type="text" 
            placeholder="Search projects, apartments..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn" aria-label="Search admin section">
            Search
          </button>
        </form>
      </div>
      <div className="topbar-right">
        <button className="notif-btn" aria-label="Notifications" onClick={handleNotificationsClick}>
          🔔
          <span className="badge">3</span>
        </button>
        <button type="button" className="profile-menu" onClick={handleProfileClick} aria-label="Open user management">
          <div className="avatar"></div>
          <div className="profile-info">
            <span className="profile-name">Admin</span>
            <span className="profile-role">Administrator</span>
          </div>
          <span className="profile-caret">▾</span>
        </button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Topbar;

