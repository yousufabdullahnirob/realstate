import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="topbar">
      <div className="topbar-search">
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <svg style={{ position: 'absolute', left: '14px', opacity: 0.5 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Search projects, apartments..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            style={{ paddingLeft: '40px' }}
          />
        </div>
      </div>
      <div className="topbar-right">
        <button className="notif-btn" aria-label="Notifications" onClick={() => navigate('/admin/notifications')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <span className="badge">3</span>
        </button>
        <div className="profile-menu">
          <div className="avatar"></div>
          <span>Admin</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Topbar;

