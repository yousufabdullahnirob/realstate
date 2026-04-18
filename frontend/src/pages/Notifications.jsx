import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiProxy from '../utils/proxyClient';

const iconMap = { booking: '📋', inquiry: '📩', payment: '💳', approval: '✅', message: '💬' };

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const data = await apiProxy.get("/notifications/", { bypassCache: true });
      setNotifications(data);
    } catch (error) {
      console.error("Notifications fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleNotifClick = async (notif) => {
    // 1. Mark as read in DB if not already
    if (!notif.is_read) {
      try {
        console.log(`[DEBUG] Marking notification ${notif.id} as read...`);
        await apiProxy.patch(`/v2/notifications/${notif.id}/`, { is_read: true });
        
        // Immediate UI update
        setNotifications(notifications => notifications.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
        
        // Dispatch event for other components (like Topbar) to update
        window.dispatchEvent(new CustomEvent('notifications-updated'));
        console.log(`[DEBUG] Notification ${notif.id} marked as read successfully.`);
      } catch (err) { 
        console.error("Failed to mark as read:", err.response?.data || err.message || err); 
      }
    }

    // 2. Navigate based on type
    switch (notif.type) {
      case 'message': navigate('/admin'); break;
      case 'inquiry': navigate('/admin/inquiries'); break;
      case 'booking': navigate('/admin/bookings'); break;
      case 'payment': navigate('/admin/payments'); break;
      default: break;
    }
  };

  const handleMarkAllRead = async () => {
    // Logic for bulk mark-read could be added here if needed
    alert("This feature is coming soon!");
  };

  console.log("Current Notifications:", notifications);
  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Notifications...</div>;

  return (
    <div className="dashboard-container">
      <div className="section-header" style={{ marginBottom: '32px' }}>
        <h2>Notifications</h2>
        <button className="add-btn" onClick={handleMarkAllRead}>Mark All Read</button>
      </div>
      
      <div className="notifications-list" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔔</div>
            <p>No notifications found.</p>
          </div>
        ) : notifications.map(notif => (
          <div 
            key={notif.id} 
            className={`notification-card ${notif.is_read ? 'read' : 'unread'}`}
            onClick={() => handleNotifClick(notif)}
            style={{ 
              display: 'flex', gap: 16, padding: '16px 20px', borderRadius: 12,
              background: notif.is_read ? '#f8fafc' : '#ffffff', 
              border: `1.5px solid ${notif.is_read ? '#e2e8f0' : '#0ea5e920'}`,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              boxShadow: notif.is_read ? 'none' : '0 4px 6px -1px rgba(14, 165, 233, 0.05)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
              if (notif.is_read) e.currentTarget.style.borderColor = '#cbd5e1';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = notif.is_read ? 'none' : '0 4px 6px -1px rgba(14, 165, 233, 0.05)';
              e.currentTarget.style.borderColor = notif.is_read ? '#e2e8f0' : '#0ea5e920';
            }}
          >
            <div style={{ fontSize: 24, padding: 4 }}>
              {iconMap[notif.type] || '🔔'}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ 
                fontSize: 14, 
                fontWeight: notif.is_read ? 500 : 700, 
                color: notif.is_read ? '#64748b' : '#0f172a',
                marginBottom: 4
              }}>{notif.message}</p>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>
                {new Date(notif.created_at).toLocaleString('en-BD', { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </div>
            {!notif.is_read && (
               <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#0ea5e9', alignSelf: 'center', boxShadow: '0 0 0 4px #0ea5e915' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;

