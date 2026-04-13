import React, { useState, useEffect } from 'react';
import apiProxy from '../utils/proxyClient';

const iconMap = { booking: '📋', inquiry: '📩', payment: '💳', approval: '✅' };

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await apiProxy.get("/notifications/");
        setNotifications(data);
      } catch (error) {
        console.error("Notifications fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Notifications...</div>;

  return (
    <div className="dashboard-container">
      <div className="section-header" style={{ marginBottom: '32px' }}>
        <h2>Notifications</h2>
        <button className="add-btn">Mark All Read</button>
      </div>
      
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔔</div>
            <p>No notifications found.</p>
          </div>
        ) : notifications.map(notif => (
          <div key={notif.id} className={`notification-item ${notif.type}`} style={{ background: notif.is_read ? 'var(--secondary)' : '#eff6ff', border: notif.is_read ? '1.5px solid var(--border-color)' : '1.5px solid #bfdbfe' }}>
            <div className="notif-icon" style={{ fontSize: 20, background: 'transparent', padding: 0 }}>
              {iconMap[notif.type] || '🔔'}
            </div>
            <div className="notif-content">
              <p style={{ fontWeight: notif.is_read ? 500 : 700 }}>{notif.message}</p>
              <span className="notif-time">{new Date(notif.created_at).toLocaleString('en-BD')}</span>
            </div>
            {!notif.is_read && (
               <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 4 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;

