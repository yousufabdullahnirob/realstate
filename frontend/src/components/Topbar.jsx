import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Settings, LogOut, Menu, User } from 'lucide-react';
import apiProxy from '../utils/proxyClient';
import { useSearch } from '../context/SearchContext';

const Topbar = ({ onToggleSidebar }) => {
  const { searchTerm, updateSearch } = useSearch();
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const fetchUnreadCount = async () => {
    try {
      const data = await apiProxy.get('/notifications/', { bypassCache: true });
      if (Array.isArray(data)) {
        const count = data.filter(n => !n.is_read).length;
        setUnreadCount(count);
      }
    } catch (e) {
      console.warn("Failed to fetch unread count:", e.message);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    window.addEventListener('notifications-updated', fetchUnreadCount);
    return () => {
      clearInterval(interval);
      window.removeEventListener('notifications-updated', fetchUnreadCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="topbar-simple">
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button className="hamburger-btn" onClick={onToggleSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Menu size={20} color="#64748b" />
        </button>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => updateSearch(e.target.value)}
            className="search-input-simple"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginLeft: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="icon-btn" onClick={() => navigate('/admin/notifications')} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
            <Bell size={20} color="#64748b" />
            {unreadCount > 0 && (
              <span style={{ 
                position: 'absolute', top: '-4px', right: '-4px', 
                background: '#ef4444', color: 'white', 
                fontSize: '10px', padding: '1px 5px', 
                borderRadius: '10px', fontWeight: 800,
                boxShadow: '0 0 0 2px white'
              }}>
                {unreadCount}
              </span>
            )}
          </button>
          <button className="icon-btn" onClick={() => navigate('/admin/profile')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <Settings size={20} color="#64748b" />
          </button>
        </div>

        <div style={{ height: '24px', width: '1px', background: '#e2e8f0' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/admin/profile')}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={18} color="white" />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Admin</span>
        </div>

        <button 
          onClick={handleLogout}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: '#0f172a', color: 'white', border: 'none', 
            padding: '8px 24px', borderRadius: '8px', fontSize: '13px', 
            fontWeight: 700, cursor: 'pointer' 
          }}
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

    </div>
  );
};

export default Topbar;
