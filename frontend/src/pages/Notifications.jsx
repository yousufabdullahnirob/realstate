import React, { useMemo, useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';
const ENABLE_BACKEND_SYNC = true;

const getAuthHeader = () => {
  const token = localStorage.getItem('access') || localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const demoNotifications = [
  { id: 1, message: 'New inquiry from Rahim Khan - Skyline Residency', time: '2min ago', type: 'inquiry' },
  { id: 2, message: 'New booking request - Apt 5A', time: '1hr ago', type: 'booking' },
  { id: 3, message: 'Project Skyline Residency - 95% complete', time: '3hrs ago', type: 'project' },
  { id: 4, message: 'Maintenance request - Apt 3B', time: '1day ago', type: 'maintenance' },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(demoNotifications);
  const [readIds, setReadIds] = useState([]);
  const [activeNotification, setActiveNotification] = useState(null);

  useEffect(() => {
    if (!ENABLE_BACKEND_SYNC) {
      return;
    }

    let isMounted = true;

    const loadNotifications = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/notifications/`, { headers: getAuthHeader() });
        if (!isMounted) {
          return;
        }

        const mapped = (Array.isArray(response.data) ? response.data : []).map((notification) => ({
          id: notification.id,
          message: notification.message,
          time: new Date(notification.created_at).toLocaleString(),
          type: notification.type,
          is_read: notification.is_read,
        }));

        const finalNotifications = mapped.length > 0 ? mapped : demoNotifications;
        setNotifications(finalNotifications);
        setReadIds(finalNotifications.filter((notification) => notification.is_read).map((notification) => notification.id));
      } catch {
        // keep demo fallback
      }
    };

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const allRead = useMemo(
    () => notifications.length > 0 && readIds.length === notifications.length,
    [notifications.length, readIds]
  );

  const markReadInBackend = async () => {};

  const handleMarkAllRead = async () => {
    const ids = notifications.map((notification) => notification.id);
    setReadIds(ids);
    await Promise.all(ids.map((id) => markReadInBackend(id)));
  };

  const handleView = async (notification) => {
    if (!readIds.includes(notification.id)) {
      setReadIds((previous) => [...previous, notification.id]);
      await markReadInBackend(notification.id);
    }
    setActiveNotification(notification);
  };

  return (
    <div className="page-content">
      <div className="admin-page-shell">
        <div className="page-header">
          <h2>Notifications</h2>
          <button className="add-btn" onClick={handleMarkAllRead} disabled={allRead}>Mark All Read</button>
        </div>
        <div className="notifications-list">
          {notifications.map(notif => (
            <div
              key={notif.id}
              className={`notification-item ${notif.type} ${readIds.includes(notif.id) ? 'is-read' : ''}`}
            >
              <div className="notif-icon">●</div>
              <div className="notif-content">
                <p>{notif.message}</p>
                <span className="notif-time">{notif.time}</span>
              </div>
              <div className="notif-actions">
                <button className="view-btn" onClick={() => handleView(notif)}>View</button>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="action-note">No notifications found.</div>
          )}
        </div>
      </div>

      {activeNotification && (
        <div className="modal-overlay active">
          <div className="modal-box">
            <h3>Notification</h3>
            <p>{activeNotification.message}</p>
            <p>{activeNotification.time}</p>
            <div className="modal-actions">
              <button className="save-btn" onClick={() => setActiveNotification(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;

