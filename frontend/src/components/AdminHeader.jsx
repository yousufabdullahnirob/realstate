import React from "react";

const AdminHeader = ({ title }) => {
  return (
    <header className="admin-header">
      <div className="header-left">
        <h3>{title}</h3>
      </div>
      <div className="header-right">
        <div className="search-bar glass" style={{ padding: '8px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search..." style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '14px' }} />
        </div>
        <div className="admin-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="admin-label">Admin Portal</span>
          <div className="admin-avatar"></div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
