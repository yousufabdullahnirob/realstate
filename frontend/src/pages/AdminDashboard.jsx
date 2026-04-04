import React, { useEffect, useState } from "react";
import "../admin.css";

import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import apiProxy from "../utils/proxyClient";
import { DataAdapter } from "../utils/dataAdapter";
import { formatBDT } from "../utils/formatters";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_projects: 0,
    total_apartments: 0,
    available_units: 0,
    booked_units: 0
  });
  const [analytics, setAnalytics] = useState({ total_overall_views: 0, top_apartments: [] });
  const [unapprovedApts, setUnapprovedApts] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsData = await apiProxy.get("/admin/stats/");
        const analyticsData = await apiProxy.get("/analytics/stats/");
        const apartmentsData = await apiProxy.get("/apartments/");
        
        setStats(statsData);
        setAnalytics(analyticsData);
        setUnapprovedApts(apartmentsData.filter(a => !a.is_approved));
        
        const paymentsData = await apiProxy.get("/payments/pending/");
        setPendingPayments(paymentsData);
      } catch (error) {
        console.error("Dashboard fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await apiProxy.patch(`/apartments/${id}/`, { is_approved: true });
      setUnapprovedApts(unapprovedApts.filter(a => a.id !== id));
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  const IconBuilding = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22V12h6v10" />
      <path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M12 6h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01M8 18h.01M16 18h.01M12 18h.01" />
    </svg>
  );

  const IconLayout = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );

  const IconEye = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const IconDollar = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );

  if (loading) return <div className="page-content" style={{ textAlign: 'center', paddingTop: '100px' }}>Syncing Global Assets...</div>;

  return (
    <div className="page-content">
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-1.5px', marginBottom: '10px' }}>Executive Overview</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Real-time platform activity and financial performance metrics.</p>
      </div>

      {/* KPI STATS */}
      <section className="stats">
        <div className="stat-card">
          <div className="icon-wrapper">
             <IconBuilding />
          </div>
          <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Active Projects</h4>
          <p style={{ fontSize: '32px', fontWeight: '800' }}>{stats.total_projects}</p>
        </div>
        <div className="stat-card">
          <div className="icon-wrapper" style={{ color: 'var(--secondary)', background: 'rgba(99, 102, 241, 0.1)' }}>
             <IconLayout />
          </div>
          <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Managed Units</h4>
          <p style={{ fontSize: '32px', fontWeight: '800' }}>{stats.total_apartments}</p>
        </div>
        <div className="stat-card">
          <div className="icon-wrapper" style={{ color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)' }}>
             <IconEye />
          </div>
          <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Engagement Views</h4>
          <p style={{ fontSize: '32px', fontWeight: '800' }}>{analytics.total_overall_views.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <div className="icon-wrapper" style={{ color: 'var(--warning)', background: 'rgba(245, 158, 11, 0.1)' }}>
             <IconDollar />
          </div>
          <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Secured Bookings</h4>
          <p style={{ fontSize: '32px', fontWeight: '800' }}>{stats.booked_units}</p>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', marginBottom: '40px' }}>
        {/* APPROVAL WORKFLOW */}
        <div className="card glass" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '30px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Property Approvals</h3>
            <span style={{ fontSize: '11px', fontWeight: '800', padding: '6px 12px', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--primary)', borderRadius: '8px', textTransform: 'uppercase' }}>{unapprovedApts.length} Pending</span>
          </div>
          <div className="admin-table-container">
            {unapprovedApts.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <th style={{ padding: '20px 30px', textAlign: 'left', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Asset Title</th>
                    <th style={{ padding: '20px 30px', textAlign: 'left', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Valuation</th>
                    <th style={{ padding: '20px 30px', textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Verification</th>
                  </tr>
                </thead>
                <tbody>
                  {unapprovedApts.map(apt => (
                    <tr key={apt.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '24px 30px' }}>
                        <p style={{ fontWeight: '800', fontSize: '15px' }}>{apt.title}</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{apt.project_name}</p>
                      </td>
                      <td style={{ padding: '24px 30px', fontWeight: '700' }}>{formatBDT(apt.price)}</td>
                      <td style={{ padding: '24px 30px', textAlign: 'right' }}>
                        <button style={{ padding: '8px 20px', background: 'var(--primary)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }} onClick={() => handleApprove(apt.id)}>Authorize</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>No properties awaiting authorization.</p>}
          </div>
        </div>

        {/* ANALYTICS PREVIEW */}
        <div className="card glass" style={{ padding: '40px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '32px' }}>Property Engagement</h3>
          <div className="analytics-list">
            {analytics.top_apartments.map(apt => (
              <div key={apt.id} className="analytics-item" style={{ marginBottom: '32px' }}>
                <div className="analytics-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700' }}>{apt.title}</span>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)' }}>{apt.total_views.toLocaleString()} clicks</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%',
                    width: `${(apt.total_views / (analytics.total_overall_views || 1)) * 100}%`,
                    background: 'var(--primary)',
                    borderRadius: '10px'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT PAYMENTS */}
      <div className="card glass" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '30px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '800' }}>Financial Ledger (Pending)</h3>
          <a href="/admin/payments" style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)', textDecoration: 'none' }}>Full Transactions →</a>
        </div>
        <div className="payment-table">
          {pendingPayments.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '20px 30px', textAlign: 'left', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reference</th>
                  <th style={{ padding: '20px 30px', textAlign: 'left', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Asset Valuation</th>
                  <th style={{ padding: '20px 30px', textAlign: 'left', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Transaction ID</th>
                  <th style={{ padding: '20px 30px', textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Validation</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayments.map(pay => (
                  <tr key={pay.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '24px 30px' }}>
                      <p style={{ fontWeight: '700', fontSize: '14px' }}>REC-{pay.id}</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pay.payment_date}</p>
                    </td>
                    <td style={{ padding: '24px 30px', fontWeight: '800', fontSize: '15px' }}>{pay.amount.toLocaleString()} BDT</td>
                    <td style={{ padding: '24px 30px', fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-secondary)' }}>{pay.transaction_id}</td>
                    <td style={{ padding: '24px 30px', textAlign: 'right' }}>
                      <a href="/admin/payments" style={{ color: 'var(--primary)', fontWeight: '800', textDecoration: 'none', fontSize: '13px' }}>Verify Funds →</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Financial Ledger is currently up to date.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;