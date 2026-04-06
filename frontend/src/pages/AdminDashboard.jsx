import React, { useEffect, useState, useCallback } from "react";
import "../admin.css";
import apiProxy from "../utils/proxyClient";
import { formatBDT } from "../utils/formatters";
import { Link } from "react-router-dom";

const ProjectStatusPieChart = ({ data }) => {
  if (!data.project_status || data.project_status.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
        <p style={{ fontWeight: 600 }}>No project data yet</p>
        <p style={{ fontSize: 12 }}>Project status data will appear here</p>
      </div>
    );
  }

  const total = data.total_projects || data.project_status.reduce((sum, item) => sum + item.count, 0);
  const radius = 80;
  const centerX = 100;
  const centerY = 100;

  let currentAngle = -Math.PI / 2; // Start from top

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          Project Status Overview
        </h4>
        <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
          {total} Projects
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total projects by status</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <svg width={200} height={200} style={{ flexShrink: 0 }}>
          {data.project_status.map((item, index) => {
            if (item.count === 0) return null;

            const percentage = total > 0 ? item.count / total : 0;
            const angle = percentage * 2 * Math.PI;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;

            // Calculate path for pie slice
            const x1 = centerX + radius * Math.cos(startAngle);
            const y1 = centerY + radius * Math.sin(startAngle);
            const x2 = centerX + radius * Math.cos(endAngle);
            const y2 = centerY + radius * Math.sin(endAngle);

            const largeArcFlag = angle > Math.PI ? 1 : 0;

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            currentAngle = endAngle;

            return (
              <path
                key={index}
                d={pathData}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        <div style={{ flex: 1 }}>
          {data.project_status.map((item, index) => {
            const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    backgroundColor: item.color,
                    marginRight: 8,
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {item.count} ({percentage}%)
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const SalesChart = ({ data }) => {
  if (!data.monthly_sales || data.monthly_sales.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
        <p style={{ fontWeight: 600 }}>No sales data yet</p>
        <p style={{ fontSize: 12 }}>Sales data will appear here once apartments are sold</p>
      </div>
    );
  }

  const maxSales = Math.max(...data.monthly_sales.map(d => d.sales));
  const chartHeight = 200;
  const chartWidth = 400;
  const barWidth = chartWidth / data.monthly_sales.length - 10;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          Monthly Sales
        </h4>
        <p style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>
          {data.total_sales}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total apartments sold</p>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: 16 }}>
        <svg width={Math.max(chartWidth, data.monthly_sales.length * (barWidth + 10))} height={chartHeight + 60} style={{ minWidth: chartWidth }}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
            const y = chartHeight - (ratio * chartHeight);
            return (
              <g key={ratio}>
                <line
                  x1={0} y1={y} x2={Math.max(chartWidth, data.monthly_sales.length * (barWidth + 10))} y2={y}
                  stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2,2"
                />
                <text
                  x={-10} y={y + 4}
                  fontSize="10" fill="var(--text-muted)" textAnchor="end"
                >
                  {Math.round(maxSales * ratio)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.monthly_sales.map((item, index) => {
            const barHeight = maxSales > 0 ? (item.sales / maxSales) * chartHeight : 0;
            const x = index * (barWidth + 10);
            const y = chartHeight - barHeight;

            return (
              <g key={index}>
                <rect
                  x={x} y={y} width={barWidth} height={barHeight || 2} // Minimum height for visibility
                  fill="#10b981" rx="2"
                />
                {barHeight > 10 && ( // Only show value text if bar is tall enough
                  <text
                    x={x + barWidth/2} y={y - 5}
                    fontSize="10" fill="var(--text-primary)" textAnchor="middle"
                  >
                    {item.sales}
                  </text>
                )}
                <text
                  x={x + barWidth/2} y={chartHeight + 15}
                  fontSize="9" fill="var(--text-muted)" textAnchor="middle"
                  transform={`rotate(-45 ${x + barWidth/2} ${chartHeight + 15})`}
                >
                  {item.month_short}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
    <div style={{
      position: 'absolute', top: 16, right: 16,
      width: 40, height: 40, borderRadius: 10,
      background: `${color}18`, border: `1.5px solid ${color}30`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
    }}>{icon}</div>
    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</p>
    <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: -1 }}>{value}</p>
    {sub && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontWeight: 500 }}>{sub}</p>}
    <div style={{ position: 'absolute', bottom: 0, left: 0, height: 3, width: '40%', background: color, borderRadius: '0 4px 0 0' }} />
  </div>
);

const Badge = ({ status }) => {
  const map = {
    pending:   { bg: '#fef3c7', border: '#f59e0b', color: '#92400e' },
    verified:  { bg: '#d1fae5', border: '#10b981', color: '#065f46' },
    rejected:  { bg: '#fee2e2', border: '#ef4444', color: '#991b1b' },
    available: { bg: '#d1fae5', border: '#10b981', color: '#065f46' },
    booked:    { bg: '#fef3c7', border: '#f59e0b', color: '#92400e' },
    sold:      { bg: '#fee2e2', border: '#ef4444', color: '#991b1b' },
    new:       { bg: '#eff6ff', border: '#3b82f6', color: '#1e40af' },
    contacted: { bg: '#f3e8ff', border: '#8b5cf6', color: '#5b21b6' },
    closed:    { bg: '#f1f5f9', border: '#cbd5e1', color: '#475569' },
  };
  const s = map[status] || { bg: '#f1f5f9', border: '#cbd5e1', color: '#475569' };
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 800,
      textTransform: 'uppercase', letterSpacing: 0.5,
      background: s.bg, border: `1.5px solid ${s.border}`, color: s.color
    }}>{status}</span>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total_projects: 0, total_apartments: 0, available_units: 0, booked_units: 0 });
  const [analytics, setAnalytics] = useState({ total_overall_views: 0, top_apartments: [] });
  const [salesData, setSalesData] = useState({ monthly_sales: [], total_sales: 0 });
  const [projectStatusData, setProjectStatusData] = useState({ project_status: [], total_projects: 0 });
  const [unapprovedApts, setUnapprovedApts] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [approvingId, setApprovingId] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const errs = {};
    const safe = async (key, fn) => {
      try { return await fn(); }
      catch (e) { errs[key] = e.message; return null; }
    };

    const [statsData, analyticsData, salesData, projectStatusData, apartmentsData, paymentsData, inquiriesData, notifsData] = await Promise.all([
      safe('stats',         () => apiProxy.get("/admin/stats/")),
      safe('analytics',     () => apiProxy.get("/analytics/stats/")),
      safe('sales',         () => apiProxy.get("/analytics/sales/")),
      safe('projects',      () => apiProxy.get("/analytics/projects/")),
      safe('apartments',    () => apiProxy.get("/apartments/")),
      safe('payments',      () => apiProxy.get("/payments/my/")),
      safe('inquiries',     () => apiProxy.get("/inquiries/")),
      safe('notifications', () => apiProxy.get("/notifications/")),
    ]);

    if (statsData)      setStats(statsData);
    if (analyticsData)  setAnalytics(analyticsData);
    if (salesData)      setSalesData(salesData);
    if (projectStatusData) setProjectStatusData(projectStatusData);
    if (apartmentsData) setUnapprovedApts(apartmentsData.filter(a => !a.is_approved));
    if (paymentsData)   setPendingPayments(Array.isArray(paymentsData) ? paymentsData.filter(p => p.verification_status === 'pending') : []);
    if (inquiriesData)  setInquiries(Array.isArray(inquiriesData) ? inquiriesData.slice(0, 5) : []);
    if (notifsData)     setNotifications(Array.isArray(notifsData) ? notifsData.slice(0, 5) : []);

    setErrors(errs);
    setLastRefresh(new Date());
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleApprove = async (id) => {
    setApprovingId(id);
    try {
      await apiProxy.patch(`/apartments/${id}/`, { is_approved: true });
      setUnapprovedApts(prev => prev.filter(a => a.id !== id));
      setStats(prev => ({ ...prev, available_units: prev.available_units + 1 }));
    } catch (e) { alert("Approval failed: " + e.message); }
    finally { setApprovingId(null); }
  };

  const handleVerifyPayment = async (id, status) => {
    setVerifyingId(id);
    try {
      await apiProxy.post(`/payments/${id}/verify/`, { status });
      setPendingPayments(prev => prev.filter(p => p.id !== id));
    } catch (e) { alert("Failed to update payment: " + e.message); }
    finally { setVerifyingId(null); }
  };

  const formatDate = (dt) => dt ? new Date(dt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: 40, height: 40, border: '3px solid var(--border-color)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading dashboard...</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: -0.5 }}>Admin Dashboard</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, marginTop: 4 }}>Last updated: {lastRefresh.toLocaleTimeString()}</p>
        </div>
        <button onClick={fetchAll} style={{
          background: 'var(--primary)', color: 'white', border: 'none',
          padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer'
        }}>↻ Refresh</button>
      </div>

      {/* Error Banner */}
      {Object.keys(errors).length > 0 && (
        <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: 12, padding: '12px 16px' }}>
          <p style={{ color: '#991b1b', fontWeight: 700, fontSize: 13 }}>
            ⚠️ Some sections failed to load: {Object.keys(errors).join(', ')}. Check your backend connection.
          </p>
        </div>
      )}

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard icon="🏗️" label="Total Projects"   value={stats.total_projects}   color="#0ea5e9" sub="Active listings" />
        <StatCard icon="🏢" label="Total Apartments" value={stats.total_apartments} color="#8b5cf6" sub="All units" />
        <StatCard icon="✅" label="Available Units"  value={stats.available_units}  color="#10b981" sub="Ready to sell" />
        <StatCard icon="💼" label="Booked & Sold"    value={stats.booked_units}     color="#f59e0b" sub="Transactions" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Sales Chart */}
        <section className="preview-section glass">
          <SalesChart data={salesData} />
        </section>

        {/* Project Status Pie Chart */}
        <section className="preview-section glass">
          <ProjectStatusPieChart data={projectStatusData} />
        </section>
      </div>

      {/* Row 2: Approvals + Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Approvals */}
        <section className="preview-section glass" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800 }}>
              Property Approvals
              {unapprovedApts.length > 0 && (
                <span style={{ marginLeft: 8, background: '#fee2e2', color: '#991b1b', border: '1.5px solid #fca5a5', borderRadius: 20, padding: '1px 8px', fontSize: 11, fontWeight: 800 }}>{unapprovedApts.length}</span>
              )}
            </h3>
            <Link to="/admin/apartments" style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textDecoration: 'none' }}>View all →</Link>
          </div>
          {unapprovedApts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
              <p style={{ fontWeight: 600 }}>All properties approved</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 280, overflowY: 'auto' }}>
              {unapprovedApts.map(apt => (
                <div key={apt.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', borderRadius: 10,
                  background: 'var(--secondary)', border: '1.5px solid var(--border-color)'
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{apt.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{apt.project_name || 'No project'} · {formatBDT(apt.price)}</p>
                  </div>
                  <button
                    onClick={() => handleApprove(apt.id)}
                    disabled={approvingId === apt.id}
                    className="approve-btn"
                    style={{ marginLeft: 12, flexShrink: 0, opacity: approvingId === apt.id ? 0.6 : 1 }}
                  >{approvingId === apt.id ? '...' : 'Approve'}</button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Analytics */}
        <section className="preview-section glass" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800 }}>Top Viewed Properties</h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{analytics.total_overall_views} total views</span>
          </div>
          {analytics.top_apartments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>👁️</div>
              <p style={{ fontWeight: 600 }}>No view data yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {analytics.top_apartments.map((apt, i) => {
                const pct = analytics.total_overall_views > 0 ? Math.round((apt.total_views / analytics.total_overall_views) * 100) : 0;
                return (
                  <div key={apt.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>
                        <span style={{ color: 'var(--text-muted)', marginRight: 6 }}>#{i + 1}</span>{apt.title}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)' }}>{apt.total_views} views</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--bg-dark)', borderRadius: 10, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--accent), #38bdf8)', borderRadius: 10 }} />
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, textAlign: 'right' }}>{pct}%</p>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Pending Payments */}
      <section className="preview-section glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>
            Pending Payment Verifications
            {pendingPayments.length > 0 && (
              <span style={{ marginLeft: 8, background: '#fef3c7', color: '#92400e', border: '1.5px solid #f59e0b', borderRadius: 20, padding: '1px 8px', fontSize: 11, fontWeight: 800 }}>{pendingPayments.length}</span>
            )}
          </h3>
          <Link to="/admin/payments" style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textDecoration: 'none' }}>Manage all →</Link>
        </div>
        {pendingPayments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>💳</div>
            <p style={{ fontWeight: 600 }}>No pending payments to verify</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Amount</th><th>Transaction ID</th><th>Date</th><th>Proof</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {pendingPayments.map(pay => (
                  <tr key={pay.id}>
                    <td style={{ fontWeight: 700 }}>#{pay.id}</td>
                    <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{formatBDT(pay.amount)}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{pay.transaction_id}</td>
                    <td>{formatDate(pay.payment_date)}</td>
                    <td>
                      {pay.payment_proof_image
                        ? <a href={pay.payment_proof_image} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 12 }}>View Proof</a>
                        : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>No proof</span>}
                    </td>
                    <td><Badge status={pay.verification_status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="approve-btn" onClick={() => handleVerifyPayment(pay.id, 'verified')} disabled={verifyingId === pay.id}>✓ Verify</button>
                        <button className="delete-btn" onClick={() => handleVerifyPayment(pay.id, 'rejected')} disabled={verifyingId === pay.id}>✕ Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Row 4: Inquiries + Notifications */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Inquiries */}
        <section className="preview-section glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800 }}>Recent Inquiries</h3>
            <Link to="/admin/inquiries" style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textDecoration: 'none' }}>View all →</Link>
          </div>
          {inquiries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📩</div>
              <p style={{ fontWeight: 600 }}>No inquiries yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {inquiries.map(inq => (
                <div key={inq.id} style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: 'var(--secondary)', border: '1.5px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>{inq.user_email}</span>
                    <Badge status={inq.status} />
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Re: {inq.apartment_title}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inq.message}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Notifications */}
        <section className="preview-section glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800 }}>Recent Notifications</h3>
            <Link to="/admin/notifications" style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textDecoration: 'none' }}>View all →</Link>
          </div>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔔</div>
              <p style={{ fontWeight: 600 }}>No notifications</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {notifications.map(n => {
                const iconMap = { booking: '📋', inquiry: '📩', payment: '💳', approval: '✅' };
                return (
                  <div key={n.id} style={{
                    display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 10,
                    background: n.is_read ? 'var(--secondary)' : '#eff6ff',
                    border: `1.5px solid ${n.is_read ? 'var(--border-color)' : '#bfdbfe'}`
                  }}>
                    <span style={{ fontSize: 20 }}>{iconMap[n.type] || '🔔'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: n.is_read ? 500 : 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.message}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{formatDate(n.created_at)}</p>
                    </div>
                    {!n.is_read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 4 }} />}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

    </div>
  );
};

export default AdminDashboard;
