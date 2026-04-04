import React, { useEffect, useState } from "react";
import apiProxy from "../utils/proxyClient";
import Header from "../components/Header";
import "../styles.css";

const ClientDashboard = () => {
    const [stats, setStats] = useState({ active_installments: 0, total_paid: 0, upcoming_due: "N/A" });
    const [properties, setProperties] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { full_name: 'Resident' };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const resp = await apiProxy.get("/client/stats/");
                setStats(resp);
                
                const props = await apiProxy.get("/apartments/my/");
                setProperties(props);
                
                const pays = await apiProxy.get("/payments/my/");
                setPayments(pays);

                const favs = await apiProxy.get("/favorites/");
                setFavorites(favs);
            } catch (error) {
                console.error("Failed to fetch client data:", error);
                // No fallback: display zero/empty if API fails to maintain data integrity
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const DiamondIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 12L12 18L18 12L12 6L6 12Z" />
        </svg>
    );

    const CalendarIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );

    const BellIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );

    if (loading) return <div className="container" style={{ paddingTop: '200px', textAlign: 'center' }}>Loading your dashboard...</div>;

    return (
        <div className="admin-container" style={{ overflowY: 'auto' }}>
            <Header />
            <div className="container" style={{ paddingTop: '160px', paddingBottom: '100px' }}>
                <div className="dashboard-header" style={{ marginBottom: '60px', textAlign: 'left' }}>
                    <div style={{ display: 'inline-block', padding: '8px 16px', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--primary)', borderRadius: '12px', fontSize: '13px', fontWeight: '800', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Platform Member Access
                    </div>
                    <h1 style={{ fontSize: '56px', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '16px', letterSpacing: '-2px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                        Welcome back, <span style={{ color: 'var(--primary)' }}>{user.full_name}</span>
                    </h1>
                    <p style={{ fontSize: '20px', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: '1.6' }}>Monitor your real estate portfolio, manage active installments, and track your investment progress.</p>
                </div>

                <div className="bento-grid" style={{ marginBottom: '80px' }}>
                    <div className="card glass" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                            <DiamondIcon />
                        </div>
                        <h4 style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800', marginBottom: '12px' }}>Total Investment Portfolio</h4>
                        <p style={{ fontSize: '48px', fontWeight: '800', color: 'var(--text-dark)', letterSpacing: '-1px' }}>
                            {stats.total_paid.toLocaleString()} <span style={{ fontSize: '20px', color: 'var(--text-muted)' }}>BDT</span>
                        </p>
                    </div>
                    <div className="card glass" style={{ padding: '48px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                            <CalendarIcon />
                        </div>
                        <h4 style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800', marginBottom: '12px' }}>Active Units</h4>
                        <p style={{ fontSize: '48px', fontWeight: '800', color: 'var(--text-dark)' }}>{stats.active_installments}</p>
                    </div>
                    <div className="card glass" style={{ padding: '48px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
                            <BellIcon />
                        </div>
                        <h4 style={{ color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800', marginBottom: '12px' }}>Next Installment</h4>
                        <p style={{ fontSize: '48px', fontWeight: '800', color: 'var(--accent)' }}>{stats.upcoming_due}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '60px' }}>
                    <section>
                        <div className="section-title" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' }}>Your Portfolio</h2>
                            <a href="/apartments" style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)', textDecoration: 'none' }}>Expand My Portfolio →</a>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {properties.length > 0 ? properties.map(prop => (
                                <div key={prop.id} className="card glass" style={{ display: 'flex', gap: '32px', padding: '24px', alignItems: 'center' }}>
                                    {prop.image && (
                                        <img src={prop.image} alt={prop.title} style={{ width: '180px', height: '140px', borderRadius: '16px', objectFit: 'cover' }} />
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <h3 style={{ fontSize: '22px', fontWeight: '800' }}>{prop.title}</h3>
                                            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', background: 'rgba(14, 165, 233, 0.08)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '6px' }}>{prop.status}</span>
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '20px' }}>{prop.location}</p>
                                        <a href={`/apartments/${prop.id}`} style={{ display: 'inline-block', fontSize: '13px', fontWeight: '800', color: 'var(--text-dark)', textDecoration: 'none', padding: '8px 16px', background: 'var(--bg-main)', borderRadius: '10px' }}>Management View →</a>
                                    </div>
                                </div>
                            )) : (
                                <div className="card glass" style={{ padding: '80px 40px', textAlign: 'center' }}>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '24px' }}>You haven't acquired any properties yet.</p>
                                    <a href="/projects" className="contact-btn" style={{ padding: '16px 32px' }}>Explore Designer Projects</a>
                                </div>
                            )}
                        </div>
                    </section>

                    <section>
                        <div className="section-title" style={{ marginBottom: '40px' }}>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' }}>Payment Ledger</h2>
                        </div>
                        <div className="card glass" style={{ padding: '0', borderRadius: '32px', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(0,0,0,0.02)' }}>
                                        <th style={{ textAlign: 'left', padding: '24px 32px', fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Descriptor</th>
                                        <th style={{ textAlign: 'right', padding: '24px 32px', fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.length > 0 ? payments.slice(0, 5).map(pay => (
                                        <tr key={pay.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                            <td style={{ padding: '24px 32px' }}>
                                                <p style={{ fontSize: '15px', fontWeight: '700' }}>Apartment Installment</p>
                                                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pay.payment_date}</p>
                                            </td>
                                            <td style={{ padding: '24px 32px', textAlign: 'right' }}>
                                                <p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-dark)' }}>{pay.amount.toLocaleString()} <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>BDT</span></p>
                                                <p style={{ fontSize: '11px', fontWeight: '800', color: pay.verification_status === 'verified' ? 'var(--success)' : 'var(--warning)', textTransform: 'uppercase' }}>{pay.verification_status}</p>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="2" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No recent ledger entries.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div style={{ padding: '32px' }}>
                                <a href="/payments/submit" className="contact-btn" style={{ width: '100%', textAlign: 'center', display: 'block', borderRadius: '16px' }}>Initiate Security Payment</a>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
