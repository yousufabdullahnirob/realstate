import React from 'react';

const mockNotifications = [
  { id: 1, message: 'New inquiry from Rahim Khan', time: '2min ago', type: 'inquiry', icon: '💬', project: 'Skyline Residency' },
  { id: 2, message: 'New booking request', time: '1hr ago', type: 'booking', icon: '📅', project: 'Apt 5A' },
  { id: 3, message: 'Project update complete', time: '3hrs ago', type: 'project', icon: '🏗', project: 'Skyline Residency - 95% complete' },
  { id: 4, message: 'Maintenance request needed', time: '1day ago', type: 'maintenance', icon: '🛠', project: 'Apt 3B' },
];

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
    <div className="admin-content">
      <div className="page-header">
        <h2>Notifications</h2>
        <button className="add-btn">Mark All Read</button>
      </div>
      
      <div className="notifications-list">
        {mockNotifications.map(notif => (
          <div key={notif.id} className={`notification-item ${notif.type}`}>
            <div className="notif-icon">
              {notif.icon}
            </div>
            <div className="notif-content">
              <p>{notif.message} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>• {notif.project}</span></p>
              <span className="notif-time">{notif.time}</span>
            </div>
            <div className="notif-actions">
              <button className="view-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;

