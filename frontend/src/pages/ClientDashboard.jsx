import React, { useEffect, useState } from "react";
import apiProxy from "../utils/proxyClient";
import Header from "../components/Header";
import "../styles.css";

const ClientDashboard = () => {
    const [stats, setStats] = useState({ active_installments: 0, total_paid: 0, upcoming_due: "N/A" });
    const [properties, setProperties] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { full_name: 'Resident' };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Mock endpoints - adjust based on actual backend implementation
                const resp = await apiProxy.get("/client/stats/");
                setStats(resp);
                
                const props = await apiProxy.get("/apartments/my/");
                setProperties(props);
                
                const pays = await apiProxy.get("/payments/my/");
                setPayments(pays);
            } catch (error) {
                console.error("Failed to fetch client data:", error);
                // Fallback for demo
                setStats({ active_installments: 3, total_paid: 12500000, upcoming_due: "2026-04-10" });
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    if (loading) return <div className="container">Loading your dashboard...</div>;

    return (
        <div className="admin-container">
            <Header />
            <div className="container" style={{ paddingTop: '120px' }}>
            <div className="dashboard-header">
                <h1>Welcome, {user.full_name}</h1>
                <p>Manage your properties and installments here.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h4>Total Paid</h4>
                    <p>{stats.total_paid.toLocaleString()} BDT</p>
                </div>
                <div className="stat-card">
                    <h4>Active Installments</h4>
                    <p>{stats.active_installments}</p>
                </div>
                <div className="stat-card">
                    <h4>Upcoming Due</h4>
                    <p>{stats.upcoming_due}</p>
                </div>
            </div>

            <div className="section-title">
                <h2>Your Properties</h2>
            </div>
            <div className="property-grid-small">
                {properties.map(prop => (
                    <div key={prop.id} className="prop-card">
                        <img src={prop.image} alt={prop.title} />
                        <div className="prop-info">
                            <h3>{prop.title}</h3>
                            <p>{prop.location}</p>
                            <span className="status-badge">{prop.status}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="section-title" style={{ marginTop: '40px' }}>
                <h2>Payment History</h2>
            </div>
            <div className="payment-history-table">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>TrxID</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(pay => (
                            <tr key={pay.id}>
                                <td>{pay.payment_date}</td>
                                <td>{pay.amount.toLocaleString()} BDT</td>
                                <td>{pay.transaction_id}</td>
                                <td><span className={`status-${pay.verification_status}`}>{pay.verification_status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <a href="/payments/submit" className="contact-btn">Submit New Payment</a>
            </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
