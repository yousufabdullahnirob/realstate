import React, { useEffect, useState } from 'react';
import apiProxy from '../utils/proxyClient';

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
    <div className="page-content">
      <div className="container">
        <div className="page-header">
          <h2>Notifications</h2>
          <button className="add-btn">Mark All Read</button>
        </div>
        <div className="notifications-list">
          {notifications.map(notif => (
            <div key={notif.id} className={`notification-item ${notif.type} ${notif.is_read ? 'read' : 'unread'}`}>
              <div className="notif-icon">{notif.is_read ? '○' : '●'}</div>
              <div className="notif-content">
                <p>{notif.message}</p>
                <span className="notif-time">{new Date(notif.created_at).toLocaleString()}</span>
              </div>
              <div className="notif-actions">
                {!notif.is_read && <button className="view-btn">Mark Read</button>}
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <p style={{ textAlign: 'center', padding: '20px' }}>No notifications yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

