import React, { useState, useEffect } from 'react';
import apiProxy from '../utils/proxyClient';
import Header from '../components/Header';

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

    const getIcon = (type) => {
        switch (type) {
            case 'payment': return '💰';
            case 'booking': return '📅';
            case 'inquiry': return '💬';
            case 'approval': return '✅';
            default: return '🔔';
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '150px', textAlign: 'center' }}>Loading Notifications...</div>;

    return (
        <div className="admin-container">
            <Header />
            <div className="container" style={{ paddingTop: '120px', maxWidth: '800px' }}>
                <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Notifications</h1>
                        <p>Stay updated with your property activities.</p>
                    </div>
                    <button className="contact-btn" style={{ padding: '8px 16px', fontSize: '14px' }}>Mark all read</button>
                </div>
                
                <div className="notifications-list" style={{ marginTop: '30px' }}>
                    {notifications.length > 0 ? notifications.map(notif => (
                        <div key={notif.id} className="card glass" style={{ 
                            padding: '20px', 
                            borderRadius: '15px', 
                            marginBottom: '15px', 
                            display: 'flex', 
                            gap: '20px', 
                            alignItems: 'center',
                            borderLeft: notif.is_read ? 'none' : '4px solid var(--accent-primary)'
                        }}>
                            <div style={{ fontSize: '24px' }}>{getIcon(notif.type)}</div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: notif.is_read ? 'normal' : 'bold' }}>{notif.message}</p>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                    {new Date(notif.created_at).toLocaleString()}
                                </span>
                            </div>
                            {!notif.is_read && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }}></div>}
                        </div>
                    )) : (
                        <div className="glass" style={{ padding: '50px', textAlign: 'center', borderRadius: '20px' }}>
                            <h3>No notifications yet</h3>
                            <p>We'll notify you when something important happens.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;

