import React, { useEffect, useState } from 'react';
import apiProxy from '../utils/proxyClient';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Reply Modal State
  const [showModal, setShowModal] = useState(false);
  const [activeInquiry, setActiveInquiry] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchInquiries = async () => {
    try {
      const data = await apiProxy.get("/inquiries/", { bypassCache: true });
      setInquiries(data);
    } catch (error) {
      console.error("Inquiries fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleOpenReply = (inquiry) => {
    setActiveInquiry(inquiry);
    setReplyText("");
    setShowModal(true);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    setSubmitting(true);
    try {
      // 1. Send Message to User
      await apiProxy.post("/v2/messages/", {
        receiver: activeInquiry.user,
        content: `Reply to your inquiry regarding ${activeInquiry.apartment_title}: ${replyText}`
      });

      // 2. Update Inquiry Status
      await apiProxy.patch(`/admin/inquiries/${activeInquiry.id}/`, {
        status: 'contacted'
      });

      // 3. Cleanup & Refresh
      await fetchInquiries();
      setShowModal(false);
      alert("Reply sent successfully and inquiry marked as contacted.");
    } catch (err) {
      alert("Failed to send reply: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async (id) => {
    if (!window.confirm("Are you sure you want to archive this inquiry?")) return;
    try {
      await apiProxy.patch(`/admin/inquiries/${id}/`, { status: 'closed' });
      await fetchInquiries();
    } catch (err) {
      alert("Failed to archive: " + err.message);
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Inquiries...</div>;

  return (
    <div className="dashboard-container" style={{ position: 'relative' }}>
      <div className="section-header" style={{ marginBottom: '32px' }}>
        <h2>Customer Inquiries</h2>
        <button className="add-btn">Export CSV</button>
      </div>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="col-id">ID</th>
              <th className="col-email">User Email</th>
              <th className="col-apt">Apartment</th>
              <th className="col-msg">Message</th>
              <th className="col-date">Date</th>
              <th className="col-status">Status</th>
              <th className="col-actions" style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map(inquiry => (
              <tr key={inquiry.id}>
                <td style={{ color: 'var(--text-muted)' }}>#{inquiry.id}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{inquiry.user_email}</td>
                <td style={{ fontWeight: '600' }}>{inquiry.apartment_title}</td>
                <td style={{ lineHeight: '1.6' }}>
                  {inquiry.message}
                </td>
                <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {new Date(inquiry.created_at).toLocaleDateString()}
                </td>
                <td>
                  <span className={`status ${inquiry.status}`} style={{
                    padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800',
                    background: inquiry.status === 'new' ? '#eff6ff' : inquiry.status === 'contacted' ? '#fef3c7' : '#f1f5f9',
                    color: inquiry.status === 'new' ? '#1e40af' : inquiry.status === 'contacted' ? '#92400e' : '#475569',
                    display: 'inline-block'
                  }}>
                    {inquiry.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>

                  <button 
                    className="edit-btn" 
                    onClick={() => handleOpenReply(inquiry)}
                    style={{ background: '#0ea5e9', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}
                  >
                    Reply
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleArchive(inquiry.id)}
                    style={{ background: 'transparent', border: '1px solid #e2e8f0', color: '#ef4444', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Archive
                  </button>
                </td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No inquiries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reply Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#fff', width: '90%', maxWidth: '500px', borderRadius: '16px',
            padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Reply to Inquiry</h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
              From: <strong>{activeInquiry.user_email}</strong> regarding <strong>{activeInquiry.apartment_title}</strong>
            </p>
            
            <form onSubmit={handleReplySubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px' }}>Your Response</label>
                <textarea 
                  required
                  rows="5"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '14px', resize: 'none', outline: 'none' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#475569', fontWeight: '700', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  style={{ 
                    padding: '10px 24px', borderRadius: '8px', border: 'none', 
                    background: '#0ea5e9', color: '#fff', fontWeight: '800', 
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.2)'
                  }}
                >
                  {submitting ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inquiries;

