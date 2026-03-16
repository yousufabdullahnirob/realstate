import React, { useEffect, useState } from "react";
import "../admin.css";

import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import apiProxy from "../utils/proxyClient";
import { DataAdapter } from "../utils/dataAdapter";

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
        
        // Mock pending payments for now or fetch if endpoint ready
        // const paymentsData = await apiProxy.get("/payments/pending/");
        // setPendingPayments(paymentsData);
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
      await apiProxy.patch(`/apartments/${id}/`, { is_approved: True });
      setUnapprovedApts(unapprovedApts.filter(a => a.id !== id));
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  if (loading) return <div className="dashboard-container">Loading Admin Overview...</div>;

  return (
    <div className="dashboard-container">
      {/* KPI STATS */}
      <section className="stats">
        <div className="stat-card">
          <h4>Total Projects</h4>
          <p>{stats.total_projects}</p>
        </div>
        <div className="stat-card">
          <h4>Total Apartments</h4>
          <p>{stats.total_apartments}</p>
        </div>
        <div className="stat-card">
          <h4>Total Views</h4>
          <p>{analytics.total_overall_views}</p>
        </div>
        <div className="stat-card">
          <h4>Booked/Sold</h4>
          <p>{stats.booked_units}</p>
        </div>
      </section>

      <div className="dashboard-grid">
        {/* APPROVAL WORKFLOW */}
        <section className="preview-section">
          <div className="section-header">
            <h3>Property Approval Needed ({unapprovedApts.length})</h3>
          </div>
          <div className="approval-list">
            {unapprovedApts.length > 0 ? unapprovedApts.map(apt => (
              <div key={apt.id} className="approval-item">
                <div className="approval-info">
                  <strong>{apt.title}</strong>
                  <span>{apt.project_name} - {parseInt(apt.price).toLocaleString()} BDT</span>
                </div>
                <button className="approve-btn" onClick={() => handleApprove(apt.id)}>Approve</button>
              </div>
            )) : <p>No properties pending approval.</p>}
          </div>
        </section>

        {/* ANALYTICS PREVIEW */}
        <section className="preview-section">
          <div className="section-header">
            <h3>Top Viewed Properties</h3>
          </div>
          <div className="analytics-list">
            {analytics.top_apartments.map(apt => (
              <div key={apt.id} className="analytics-item">
                <div className="analytics-bar" style={{ width: `${(apt.total_views / analytics.total_overall_views) * 100}%` }}></div>
                <div className="analytics-label">
                  <span>{apt.title}</span>
                  <strong>{apt.total_views} views</strong>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* RECENT PAYMENTS */}
      <section className="preview-section">
        <div className="section-header">
          <h3>Pending Payment Verifications</h3>
          <a href="/admin/payments" className="manage-btn">View All</a>
        </div>
        <div className="payment-table">
          <p>Section under implementation. Active in Payment Management tab.</p>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;