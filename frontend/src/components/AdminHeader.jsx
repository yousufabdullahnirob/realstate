import React from "react";

const AdminHeader = ({ title }) => {
  return (
    <header className="admin-header">
      <div className="header-left">
        <h3 style={{ fontSize: '24px', fontWeight: '800', background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{title}</h3>
      </div>
      <div className="header-right">
        <div className="top-search" style={{ 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid var(--glass-border)', 
            padding: '10px 20px', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            transition: 'all 0.3s ease'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search data points..." style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', fontSize: '14px', fontWeight: '600' }} />
        </div>
        <div className="admin-profile" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div className="admin-badge" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', color: '#fff', padding: '6px 14px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
            Active Session
          </div>
          <div className="admin-avatar" style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'linear-gradient(135deg, #334155 0%, #0f172a 100%)', border: '1px solid var(--glass-border)', cursor: 'pointer' }}></div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
