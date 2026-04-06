import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiProxy from "../utils/proxyClient";
import { formatBDT } from "../utils/formatters";

const ClientDashboard = () => {
  const [stats, setStats] = useState({ active_installments: 0, total_paid: 0, upcoming_due: "N/A" });
  const [properties, setProperties] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : { full_name: "Resident" };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, propsRes, paysRes] = await Promise.allSettled([
          apiProxy.get("/client/stats/"),
          apiProxy.get("/apartments/my/"),
          apiProxy.get("/payments/my/"),
        ]);
        if (statsRes.status === "fulfilled") setStats(statsRes.value);
        if (propsRes.status === "fulfilled") setProperties(Array.isArray(propsRes.value) ? propsRes.value : []);
        if (paysRes.status === "fulfilled") setPayments(Array.isArray(paysRes.value) ? paysRes.value : []);
      } catch (e) {
        console.error("Dashboard error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dt) => dt ? new Date(dt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" }) : "N/A";

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <p style={{ color: "#94a3b8", fontWeight: 600 }}>Loading your dashboard...</p>
    </div>
  );

  return (
    <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", padding: "32px 40px", maxWidth: 1100, margin: "0 auto" }}>

      {/* Welcome */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: -0.5 }}>
          Welcome back, {user.full_name} 👋
        </h1>
        <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 6 }}>Here is an overview of your account.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Paid", value: formatBDT(stats.total_paid), icon: "💰", color: "#10b981" },
          { label: "Active Installments", value: stats.active_installments, icon: "📋", color: "#0ea5e9" },
          { label: "Upcoming Due", value: formatDate(stats.upcoming_due), icon: "📅", color: "#f59e0b" },
        ].map(card => (
          <div key={card.label} style={{
            background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12,
            padding: "24px 28px", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 16, right: 16, width: 40, height: 40,
              borderRadius: 10, background: card.color + "18",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>{card.icon}</div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{card.label}</p>
            <p style={{ fontSize: 26, fontWeight: 800, color: "#0f172a" }}>{card.value}</p>
            <div style={{ position: "absolute", bottom: 0, left: 0, height: 3, width: "40%", background: card.color, borderRadius: "0 4px 0 0" }} />
          </div>
        ))}
      </div>

      {/* My Properties */}
      <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: 28, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>My Properties</h2>
        {properties.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🏢</div>
            <p style={{ fontWeight: 600 }}>No properties yet</p>
            <Link to="/apartments" style={{ color: "#0ea5e9", fontWeight: 700, fontSize: 13, textDecoration: "none", marginTop: 8, display: "inline-block" }}>
              Browse Apartments →
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {properties.map(prop => (
              <div key={prop.id} style={{ borderRadius: 10, overflow: "hidden", border: "1.5px solid #e2e8f0" }}>
                {prop.image && (
                  <div style={{ height: 140, backgroundImage: `url(${prop.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                )}
                <div style={{ padding: "14px 16px" }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 4 }}>{prop.title}</p>
                  <p style={{ fontSize: 12, color: "#94a3b8" }}>📍 {prop.location}</p>
                  <span style={{
                    display: "inline-block", marginTop: 8, padding: "3px 10px",
                    borderRadius: 6, fontSize: 11, fontWeight: 800, textTransform: "uppercase",
                    background: prop.status === "available" ? "#d1fae5" : prop.status === "booked" ? "#fef3c7" : "#fee2e2",
                    color: prop.status === "available" ? "#065f46" : prop.status === "booked" ? "#92400e" : "#991b1b",
                  }}>{prop.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment History */}
      <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: 28, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Payment History</h2>
          <Link to="/submit-payment" style={{ fontSize: 12, fontWeight: 700, color: "#0ea5e9", textDecoration: "none" }}>
            + Submit Payment
          </Link>
        </div>
        {payments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#94a3b8" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💳</div>
            <p style={{ fontWeight: 600 }}>No payment history yet</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #f1f5f9" }}>
                {["Date", "Amount", "Transaction ID", "Status"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map(pay => (
                <tr key={pay.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "12px" }}>{formatDate(pay.payment_date)}</td>
                  <td style={{ padding: "12px", fontWeight: 700, color: "#0ea5e9" }}>{formatBDT(pay.amount)}</td>
                  <td style={{ padding: "12px", fontFamily: "monospace", fontSize: 12 }}>{pay.transaction_id}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 800, textTransform: "uppercase",
                      background: pay.verification_status === "verified" ? "#d1fae5" : pay.verification_status === "rejected" ? "#fee2e2" : "#fef3c7",
                      color: pay.verification_status === "verified" ? "#065f46" : pay.verification_status === "rejected" ? "#991b1b" : "#92400e",
                    }}>{pay.verification_status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default ClientDashboard;
