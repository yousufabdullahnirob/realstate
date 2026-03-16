import React, { useState } from 'react';

const Topbar = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="topbar">
      <div className="topbar-search">
        <input 
          type="text" 
          placeholder="Search projects, apartments..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="topbar-right">
        <button className="notif-btn" aria-label="Notifications">
          🔔
          <span className="badge">3</span>
        </button>
        <div className="profile-menu">
          <div className="avatar"></div>
          <span>Admin</span>
        </div>
        <button className="logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default Topbar;

