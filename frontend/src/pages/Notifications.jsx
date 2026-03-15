import React from 'react';

const mockNotifications = [
  { id: 1, message: 'New inquiry from Rahim Khan - Skyline Residency', time: '2min ago', type: 'inquiry' },
  { id: 2, message: 'New booking request - Apt 5A', time: '1hr ago', type: 'booking' },
  { id: 3, message: 'Project Skyline Residency - 95% complete', time: '3hrs ago', type: 'project' },
  { id: 4, message: 'Maintenance request - Apt 3B', time: '1day ago', type: 'maintenance' },
];

const Notifications = () => {
  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header">
          <h2>Notifications</h2>
          <button className="add-btn">Mark All Read</button>
        </div>
        <div className="notifications-list">
          {mockNotifications.map(notif => (
            <div key={notif.id} className={`notification-item ${notif.type}`}>
              <div className="notif-icon">●</div>
              <div className="notif-content">
                <p>{notif.message}</p>
                <span className="notif-time">{notif.time}</span>
              </div>
              <div className="notif-actions">
                <button className="view-btn">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

