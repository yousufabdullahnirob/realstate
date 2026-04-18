import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  LayoutDashboard, 
  CheckCircle2, 
  ShoppingBag,
  RefreshCcw,
  Bell,
  Check
} from "lucide-react";
import "../admin.css";
import apiProxy from "../utils/proxyClient";
import { useSearch } from "../context/SearchContext";

const StatCard = ({ label, value, icon: Icon, color, link, filter }) => {
  const navigate = useNavigate();
  return (
    <div 
      className="stat-card" 
      onClick={() => navigate(link, { state: { filter } })}
      style={{ cursor: 'pointer' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <p className="label">{label}</p>
        <div style={{ color: color }}>
          <Icon size={20} />
        </div>
      </div>
      <h3 className="value">{value || 0}</h3>
    </div>
  );
};


const AdminDashboard = () => {
  const { updateSearch } = useSearch();
  const [stats, setStats] = useState({ 
    total_projects: 0, 
    total_apartments: 0, 
    available_units: 0, 
    booked_units: 0,
    project_status_counts: { Upcoming: 0, Ongoing: 0, Completed: 0 }
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const sData = await apiProxy.get("/admin/stats/");
      const nData = await apiProxy.get("/notifications/?limit=5");
      if (sData) setStats(sData);
      if (nData) setNotifications(nData);
    } catch (e) {
      console.error("Dashboard error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    updateSearch(''); // Critical: Clear any search filters
    fetchData();
  }, [updateSearch, fetchData]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <RefreshCcw className="spinning" size={32} color="#0f172a" />
    </div>
  );

  return (
    <div style={{ padding: '32px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back to Mahim Builders Management Console.</p>
      </header>

      <div className="stats-grid">
        <StatCard label="Total Projects" value={stats.total_projects} icon={Building2} color="#3b82f6" link="/admin/projects" />
        <StatCard label="Total Apartments" value={stats.total_apartments} icon={LayoutDashboard} color="#8b5cf6" link="/admin/apartments" />
        <StatCard label="Available Units" value={stats.available_units} icon={CheckCircle2} color="#10b981" link="/admin/apartments" filter="available" />
        <StatCard label="Booked & Sold" value={stats.booked_units} icon={ShoppingBag} color="#f59e0b" link="/admin/apartments" filter="booked_sold" />
      </div>


      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
        <section style={{ background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>Project Status Distribution</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '60px' }}>
             {/* Dynamic CSS Donut Chart */}
             <div style={{ 
                width: '180px', 
                height: '180px', 
                borderRadius: '50%', 
                background: (() => {
                  const total = stats.total_projects || 1;
                  const p = stats.project_status_counts || {};
                  const upcoming = ((p.Upcoming || 0) / total) * 100;
                  const ongoing = ((p.Ongoing || 0) / total) * 100;
                  // Bold solid colors: Upcoming: #3b82f6, Ongoing: #f59e0b, Completed: #10b981
                  return `conic-gradient(
                    #3b82f6 0% ${upcoming}%, 
                    #f59e0b ${upcoming}% ${upcoming + ongoing}%, 
                    #10b981 ${upcoming + ongoing}% 100%
                  )`;
                })(),
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative',
                boxShadow: '0 10px 25px rgba(15, 23, 42, 0.1)'
             }}>
                <div style={{ 
                  position: 'absolute', 
                  inset: '32px',  /* Increased padding = thicker chart slices */
                  background: 'white', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px', 
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  {stats.total_projects}
                </div>
             </div>


             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.entries(stats?.project_status_counts || {}).map(([status, count]) => (
                  <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: status === 'Ongoing' ? '#f59e0b' : status === 'Completed' ? '#10b981' : '#3b82f6' }}></div>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{status}:</span>
                    <span style={{ fontWeight: 800 }}>{count}</span>
                  </div>

                ))}
             </div>
          </div>
        </section>

        <section style={{ background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Notifications</h3>
            <Bell size={18} color="var(--text-muted)" />
          </div>
          {notifications.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No new notifications</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  onClick={() => navigate('/admin/inquiries')}
                  style={{ 
                    padding: '12px', 
                    borderRadius: '12px', 
                    background: n.is_read ? '#f8fafc' : '#eff6ff', 
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <p style={{ fontSize: '13px', fontWeight: n.is_read ? 500 : 700 }}>{n.message}</p>
                </div>
              ))}
            </div>

          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
