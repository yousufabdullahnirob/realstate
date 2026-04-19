import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiProxy from "../utils/proxyClient";
import { formatBDT } from "../utils/formatters";
import { Settings } from "lucide-react";

const ClientDashboard = () => {
  const [stats, setStats] = useState({ total_bookings: 0, confirmed_bookings: 0, pending_bookings: 0 });
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState({});

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : { full_name: "Resident" };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propsRes, booksRes, favsRes, adminsRes, msgsRes] = await Promise.allSettled([
          apiProxy.get("/apartments/my/"),
          apiProxy.get("/bookings/my/"),
          apiProxy.get("/favorites/"),
          apiProxy.get("/v2/admins/"),
          apiProxy.get("/v2/messages/"),
        ]);
        if (propsRes.status === "fulfilled") setProperties(Array.isArray(propsRes.value) ? propsRes.value : []);
        if (booksRes.status === "fulfilled") setBookings(Array.isArray(booksRes.value) ? booksRes.value : []);
        if (favsRes.status === "fulfilled") setFavorites(Array.isArray(favsRes.value) ? favsRes.value : []);
        if (adminsRes.status === "fulfilled") setAdmins(adminsRes.value);
        if (msgsRes.status === "fulfilled") setMessages(msgsRes.value);

        // Calculate stats
        if (booksRes.status === "fulfilled") {
          const books = Array.isArray(booksRes.value) ? booksRes.value : [];
          setStats({
            total_bookings: books.length,
            confirmed_bookings: books.filter(b => b.status === 'confirmed').length,
            pending_bookings: books.filter(b => b.status === 'pending').length
          });
        }
      } catch (e) {
        console.error("Dashboard error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // REAL-TIME SIMULATION: Polling for messages every 10 seconds
    const interval = setInterval(async () => {
      try {
        const msgs = await apiProxy.get("/v2/messages/", { bypassCache: true });
        setMessages(msgs);
      } catch (e) { console.error("Polling error:", e); }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dt) => dt ? new Date(dt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" }) : "N/A";

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await apiProxy.post(`/bookings/${bookingId}/cancel/`);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
      alert("Booking cancelled.");
    } catch (err) {
      alert("Failed to cancel booking: " + err.message);
    }
  };

  const handlePaymentUpload = async (bookingId, formData) => {
    setUploadLoading(prev => ({ ...prev, [bookingId]: true }));
    try {
      await apiProxy.post(`/bookings/${bookingId}/payment/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setBookings(prev => prev.map(b =>
        b.id === bookingId ? { ...b, transaction_id: formData.get('transaction_id') } : b
      ));
      alert("Payment proof uploaded successfully! Waiting for admin approval.");
    } catch (err) {
      alert("Failed to upload payment proof: " + err.message);
    } finally {
      setUploadLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    if (admins.length === 0) return alert("System error: No admin available to chat.");

    try {
      const res = await apiProxy.post("/v2/messages/", {
        receiver: admins[0].id,
        content: newMessage
      });
      setMessages([...messages, res]);
      setNewMessage("");
    } catch (e) { alert("Message failed: " + e.message); }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <p style={{ color: "#94a3b8", fontWeight: 600 }}>Loading your dashboard...</p>
    </div>
  );

  return (
    <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", padding: "32px 40px", maxWidth: 1100, margin: "0 auto" }}>

      {/* Welcome */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: -0.5 }}>
              Welcome back, {user.full_name} 👋
            </h1>
            <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 6 }}>Here is an overview of your account.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link 
              to="/profile" 
              style={{ 
                width: '40px', height: '40px', borderRadius: '10px', 
                background: '#f1f5f9', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', cursor: 'pointer', color: '#475569',
                transition: 'all 0.3s ease', border: '1px solid #e2e8f0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'rotate(30deg)';
                e.currentTarget.style.color = '#0ea5e9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'rotate(0deg)';
                e.currentTarget.style.color = '#475569';
              }}
            >
              <Settings size={20} />
            </Link>
            <Link to="/apartments" style={{ padding: "10px 20px", background: "#0ea5e9", color: "#fff", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: 13 }}>
              Find More Apartments
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { label: "Total Bookings", value: stats.total_bookings, icon: "📋", color: "#0ea5e9" },
          { label: "Pending", value: stats.pending_bookings, icon: "⏳", color: "#f59e0b" },
          { label: "Confirmed", value: stats.confirmed_bookings, icon: "✅", color: "#10b981" },
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

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24, marginBottom: 32 }}>
        {/* Bookings Section */}
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>Booking Status</h2>
          {bookings.length === 0 ? (
            <p style={{ color: "#94a3b8", fontSize: 14 }}>No bookings yet.</p>
          ) : (
            bookings.map(book => {
              const fileInputId = `payment-${book.id}`;
              return (
                <div key={book.id} style={{ padding: "16px 0", borderBottom: "1.5px solid #f1f5f9" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{book.apartment_title}</p>
                      <p style={{ fontSize: 11, color: "#94a3b8" }}>Ref: {book.booking_reference}</p>
                      <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Advance: {formatBDT(book.advance_amount)}</p>
                    </div>
                    <span style={{
                      padding: "4px 12px", borderRadius: 6, fontSize: 10, fontWeight: 800, textTransform: "uppercase",
                      background: book.status === "confirmed" ? "#d1fae5" : book.status === "pending" ? "#fef3c7" : "#fee2e2",
                      color: book.status === "confirmed" ? "#065f46" : book.status === "pending" ? "#92400e" : "#991b1b",
                    }}>{book.status}</span>
                  </div>

                  {/* ADMIN UPDATES (Due Date & Alerts) - ADDED FOR VISIBILITY */}
                  {book.final_payment_due_date && (
                    <div style={{ marginBottom: 12, padding: '8px 12px', background: '#ecfdf5', border: '1px solid #10b981', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px' }}>📅</span>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#065f46' }}>
                        Final Payment Due: {new Date(book.final_payment_due_date).toLocaleDateString("en-BD", { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  )}

                  {book.cancelled_by_admin && book.cancellation_reason && (
                    <div style={{ marginBottom: 12, padding: '8px 12px', background: '#fef2f2', border: '1px solid #ef4444', borderRadius: '8px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#991b1b', marginBottom: 2 }}>Admin Note (Rejection Reason):</p>
                      <p style={{ fontSize: '13px', color: '#b91c1c' }}>{book.cancellation_reason}</p>
                    </div>
                  )}

                  {/* Payment Proof Upload (only for pending) */}
                  {book.status === 'pending' && !book.transaction_id && (
                    <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, marginBottom: 12 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Upload Payment Proof</p>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input 
                          type="text" 
                          placeholder="Transaction ID (e.g., 7K2B8P9Q)"
                          id={`txn-${book.id}`}
                          style={{ flex: 1, padding: "6px 10px", borderRadius: 4, border: "1px solid #e2e8f0", fontSize: 12 }}
                        />
                        <input 
                          type="file" 
                          id={fileInputId}
                          accept="image/*,application/pdf"
                          style={{ display: "none" }}
                        />
                        <button 
                          onClick={() => document.getElementById(fileInputId).click()}
                          style={{ padding: "6px 12px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 4, cursor: "pointer", fontSize: 12 }}
                        >
                          📎 File
                        </button>
                        <button 
                          onClick={() => {
                            const txnId = document.getElementById(`txn-${book.id}`).value;
                            const file = document.getElementById(fileInputId).files[0];
                            if (!txnId || !file) {
                              alert("Please enter transaction ID and select a file");
                              return;
                            }
                            const formData = new FormData();
                            formData.append('transaction_id', txnId);
                            formData.append('payment_proof', file);
                            handlePaymentUpload(book.id, formData);
                          }}
                          disabled={uploadLoading[book.id]}
                          style={{ padding: "6px 12px", background: "#0ea5e9", color: "white", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700 }}
                        >
                          {uploadLoading[book.id] ? "Uploading..." : "Submit"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Payment Status */}
                  {book.transaction_id && (
                    <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, fontSize: 12 }}>
                      <p style={{ color: "#94a3b8", marginBottom: 4 }}>Transaction ID: <strong style={{ color: "#0f172a" }}>{book.transaction_id}</strong></p>
                      <p style={{ color: "#94a3b8" }}>Status: <strong style={{ color: book.status === 'confirmed' ? '#10b981' : '#f59e0b' }}>{book.status === 'confirmed' ? '✅ Approved' : '⏳ Pending Admin Review'}</strong></p>
                    </div>
                  )}

                  {/* Cancel Button */}\n                  {book.status === 'pending' && !book.is_locked && (
                    <button 
                      onClick={() => handleCancelBooking(book.id)}
                      style={{ marginTop: 12, background: 'transparent', border: '1px solid #fee2e2', color: '#991b1b', borderRadius: '4px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Cancel Booking
                    </button>
                  )}
                  {book.is_locked && (
                    <p style={{ marginTop: 12, fontSize: '12px', color: '#991b1b', fontWeight: 700 }}>🔒 Booking locked - Payment received</p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Wishlist Section */}
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>My Wishlist</h2>
          {favorites.length === 0 ? (
            <p style={{ color: "#94a3b8", fontSize: 14 }}>Nothing bookmarked.</p>
          ) : (
            favorites.map(fav => (
              <div key={fav.id} style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 6, background: "#f1f5f9", marginRight: 12, backgroundImage: `url(${fav.apartment_details?.image})`, backgroundSize: "cover" }} />
                <div>
                  <Link to={`/apartments/${fav.apartment}`} style={{ display: "block", fontWeight: 700, fontSize: 13, color: "#0f172a", textDecoration: "none" }}>{fav.apartment_details?.title}</Link>
                  <p style={{ fontSize: 11, color: "#94a3b8" }}>{formatBDT(fav.apartment_details?.price)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat with Admin Section */}
      <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>Chat with Support</h2>
        <div style={{ height: 300, overflowY: "auto", padding: 12, border: "1px solid #f1f5f9", borderRadius: 8, background: "#f8fafc", marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {messages.length === 0 && <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 13, marginTop: 100 }}>Start a conversation with our admin team.</p>}
          {messages.map(msg => (
            <div key={msg.id} style={{
              alignSelf: msg.sender_email === user.email ? "flex-end" : "flex-start",
              background: msg.sender_email === user.email ? "#0ea5e9" : "#fff",
              color: msg.sender_email === user.email ? "#fff" : "#0f172a",
              padding: "8px 14px", borderRadius: 12, maxWidth: "80%",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)", border: msg.sender_email === user.email ? "none" : "1px solid #e2e8f0"
            }}>
              <p style={{ fontSize: 13 }}>{msg.content}</p>
              <p style={{ fontSize: 9, opacity: 0.7, marginTop: 4, textAlign: "right" }}>{new Date(msg.timestamp).toLocaleTimeString()}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} style={{ display: "flex", gap: 10 }}>
          <input 
            type="text" 
            placeholder="Type your message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13 }}
          />
          <button type="submit" style={{ background: "#0ea5e9", color: "#fff", border: "none", borderRadius: 8, padding: "0 20px", fontWeight: 700, cursor: "pointer" }}>Send</button>
        </form>
      </div>

    </div>
  );
};

export default ClientDashboard;
