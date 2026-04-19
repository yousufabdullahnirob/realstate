import React, { useEffect, useState, useCallback, useMemo } from 'react';
import apiProxy from '../utils/proxyClient';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Chat / Modal State
  const [showModal, setShowModal] = useState(false);
  const [activeInquiry, setActiveInquiry] = useState(null);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [activeChatEmail, setActiveChatEmail] = useState("");
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchInquiries = useCallback(async () => {
    try {
      const data = await apiProxy.get("/inquiries/", { bypassCache: true });
      setInquiries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Inquiries fetch failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const data = await apiProxy.get("/v2/messages/", { bypassCache: true });
      setAllMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Messages fetch failed:", e);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
    fetchMessages();
    
    // Polling for real-time updates (every 5 seconds)
    const interval = setInterval(() => {
      fetchMessages();
      fetchInquiries();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [fetchInquiries, fetchMessages]);

  const handleOpenReply = (entry) => {
    setActiveInquiry(entry);
    setActiveChatUser(entry.user);
    setActiveChatEmail(entry.user_email);
    setReplyText("");
    setShowModal(true);
    fetchMessages();
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeChatUser) return;
    
    setSubmitting(true);
    try {
      const res = await apiProxy.post("/v2/messages/", {
        receiver: activeChatUser,
        content: replyText
      });
      
      setAllMessages(prev => [...prev, res]);
      setReplyText("");
      
      // If it's a real NEW inquiry, mark it contacted
      if (activeInquiry && !activeInquiry.is_virtual && activeInquiry.status === 'new') {
        await apiProxy.patch(`/admin/inquiries/${activeInquiry.id}/`, { status: 'contacted' });
        fetchInquiries();
      }
    } catch (err) {
      alert("Failed to send message: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async (id) => {
    if (!window.confirm("Are you sure you want to archive this inquiry?")) return;
    try {
      await apiProxy.patch(`/admin/inquiries/${id}/`, { status: 'closed' });
      fetchInquiries();
    } catch (err) {
      alert("Failed to archive: " + err.message);
    }
  };

  // UNIFIED LOGIC: Logic to merge inquiries and messages into a single interaction list
  const unifiedInbox = useMemo(() => {
    const userStr = localStorage.getItem("user");
    const adminEmail = userStr ? JSON.parse(userStr).email : "";
    const inboxMap = new Map();

    // 1. Add all formal inquiries to the map
    inquiries.forEach(inq => {
      inboxMap.set(inq.user_email, {
        ...inq,
        display_message: inq.message,
        last_interaction: inq.created_at,
        is_virtual: false,
        type: "INQUIRY"
      });
    });

    // 2. Iterate through all messages to find conversations and update interaction state
    allMessages.forEach(msg => {
      const otherEmail = msg.sender_email === adminEmail ? msg.receiver_email : msg.sender_email;
      const otherId = msg.sender_email === adminEmail ? msg.receiver : msg.sender;
      
      if (!otherEmail || otherEmail === adminEmail) return;
      if (otherEmail.includes("admin@") || otherEmail.includes("agent@")) return; // skip internal

      if (!inboxMap.has(otherEmail)) {
        // Create a virtual inquiry if no formal inquiry exists
        inboxMap.set(otherEmail, {
          id: `chat-${otherId}`,
          user: otherId,
          user_email: otherEmail,
          apartment_title: "General support",
          display_message: msg.content,
          message: msg.content,
          status: "chat",
          created_at: msg.timestamp,
          last_interaction: msg.timestamp,
          is_virtual: true,
          type: "CHAT"
        });
      } else {
        // Update the existing entry with the latest message content and timestamp
        const entry = inboxMap.get(otherEmail);
        if (new Date(msg.timestamp) > new Date(entry.last_interaction)) {
          entry.last_interaction = msg.timestamp;
          entry.display_message = msg.content;
          // Also set status to chat if it was contacted or closed to bring it back to attention
          if (entry.status === 'contacted') entry.status = 'chat';
        }
      }
    });

    return Array.from(inboxMap.values()).sort((a, b) => new Date(b.last_interaction) - new Date(a.last_interaction));
  }, [inquiries, allMessages]);

  const currentConversation = allMessages.filter(msg => {
    // If we have a user ID, use it. Otherwise use email.
    if (activeChatUser) {
        return (msg.sender === activeChatUser || msg.receiver === activeChatUser);
    }
    return (msg.sender_email === activeChatEmail || msg.receiver_email === activeChatEmail);
  });

  if (loading) return (
    <div style={{ padding: '100px', textAlign: 'center' }}>
      <div className="loader" style={{ marginBottom: '20px' }}></div>
      <p style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Setting up your unified dashboard...</p>
    </div>
  );

  return (
    <div className="dashboard-container" style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="section-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-1.5px', marginBottom: '8px' }}>Admin Inbox</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>Property inquiries and live chats in one place</p>
        </div>
        <div style={{ padding: '12px 20px', background: '#eff6ff', borderRadius: '14px', border: '1px solid #dbeafe' }}>
          <p style={{ fontSize: '12px', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Logged in as Sole Admin</p>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#1e3a8a' }}>admin@mahimbuilders.com</p>
        </div>
      </div>
      
      <div className="admin-table-container glass-premium" style={{ background: 'rgba(255,255,255,0.8)', borderRadius: '24px', border: '1.5px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #f1f5f9' }}>
              <th style={{ padding: '20px', textAlign: 'left', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Type</th>
              <th style={{ padding: '20px', textAlign: 'left', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Customer Info</th>
              <th style={{ padding: '20px', textAlign: 'left', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Context</th>
              <th style={{ padding: '20px', textAlign: 'left', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Latest Interaction</th>
              <th style={{ padding: '20px', textAlign: 'left', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Time</th>
              <th style={{ padding: '20px', textAlign: 'left', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status</th>
              <th style={{ padding: '20px', textAlign: 'right', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {unifiedInbox.map(entry => (
              <tr key={entry.id} className="table-row-hover" style={{ borderBottom: '1.5px solid #f8fafc', transition: 'all 0.2s' }}>
                <td style={{ padding: '20px' }}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '10px', 
                    background: entry.type === 'INQUIRY' ? '#eff6ff' : '#f0fdf4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px'
                  }}>
                    {entry.type === 'INQUIRY' ? '🏠' : '💬'}
                  </div>
                </td>
                <td style={{ padding: '20px' }}>
                  <p style={{ color: 'var(--text-primary)', fontWeight: '800', fontSize: '14px' }}>{entry.user_email}</p>
                </td>
                <td style={{ padding: '20px', fontWeight: '600', fontSize: '13px', color: '#475569' }}>{entry.apartment_title}</td>
                <td style={{ padding: '20px', lineHeight: '1.5', fontSize: '13px', color: '#64748b', maxWidth: '300px' }}>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {entry.display_message}
                  </div>
                </td>
                <td style={{ padding: '20px', fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {new Date(entry.last_interaction).toLocaleDateString()} {new Date(entry.last_interaction).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td style={{ padding: '20px' }}>
                  <span style={{
                    padding: '6px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase',
                    background: entry.status === 'new' ? '#fee2e2' : entry.status === 'contacted' ? '#fef3c7' : '#ecfdf5',
                    color: entry.status === 'new' ? '#ef4444' : entry.status === 'contacted' ? '#d97706' : '#10b981',
                    display: 'inline-block'
                  }}>
                    {entry.status}
                  </span>
                </td>
                <td style={{ padding: '20px', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleOpenReply(entry)}
                    style={{ background: '#0ea5e9', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', marginRight: '8px', fontWeight: 800, fontSize: '12px', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)' }}
                  >
                    Open Chat
                  </button>
                  {!entry.is_virtual && (
                    <button 
                      onClick={() => handleArchive(entry.id)}
                      style={{ background: 'transparent', border: '1px solid #f1f5f9', color: '#94a3b8', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: 800, fontSize: '12px' }}
                    >
                      Archive
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {unifiedInbox.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '100px', color: 'var(--text-muted)', fontSize: '16px', fontWeight: 700 }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.2 }}>📭</div>
                  Your inbox is empty
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Real-time Premium Chat Modal */}
      {showModal && activeInquiry && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(15, 23, 42, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, backdropFilter: 'blur(12px)'
        }}>
          <div style={{
            background: '#fff', width: '95%', maxWidth: '600px', borderRadius: '32px',
            overflow: 'hidden', boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex', flexDirection: 'column', height: '85vh', border: '1px solid rgba(255,255,255,0.1)'
          }}>
            {/* Header */}
            <div style={{ padding: '32px', background: '#0f172a', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                  <h3 style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px' }}>Live Conversation</h3>
                </div>
                <p style={{ fontSize: '13px', opacity: 0.6, fontWeight: 500 }}>{activeInquiry.user_email}</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '44px', height: '44px', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}
              >✕</button>
            </div>
            
            {/* Chat Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '32px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {!activeInquiry.is_virtual && (
                <div style={{ alignSelf: 'center', background: '#fff', border: '1.5px solid #e2e8f0', color: '#475569', padding: '16px 24px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '24px', textAlign: 'center', maxWidth: '90%', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                  <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px', fontWeight: 800, letterSpacing: '1px' }}>Inquiry: {activeInquiry.apartment_title}</p>
                  "{activeInquiry.message}"
                </div>
              )}
              
              {currentConversation.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '60px', opacity: 0.5 }}>
                  <div style={{ fontSize: '56px', marginBottom: '24px' }}>💬</div>
                  <p style={{ color: '#94a3b8', fontSize: '15px', fontWeight: 700 }}>No chat messages yet.</p>
                </div>
              )}
              
              {currentConversation.map((msg, i) => {
                const isAdmin = msg.sender_role === 'admin' || msg.sender_email === 'admin@mahimbuilders.com' || msg.sender_email.includes("admin@");
                return (
                  <div key={msg.id || i} style={{
                    alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                    maxWidth: '85%', display: 'flex', flexDirection: 'column',
                    alignItems: isAdmin ? 'flex-end' : 'flex-start'
                  }}>
                    <div style={{
                      padding: '14px 20px', 
                      borderRadius: isAdmin ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                      background: isAdmin ? '#0ea5e9' : '#fff',
                      color: isAdmin ? '#fff' : '#0f172a',
                      fontSize: '14px', fontWeight: 500, lineHeight: '1.6',
                      boxShadow: '0 4px 12px -1px rgba(0,0,0,0.1)',
                      border: isAdmin ? 'none' : '1.5px solid #f1f5f9'
                    }}>
                      {msg.content}
                    </div>
                    <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '8px', fontWeight: 800, marginInline: '12px' }}>
                       {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Footer / Input */}
            <form onSubmit={handleReplySubmit} style={{ padding: '32px', borderTop: '1.5px solid #f1f5f9', background: '#fff', display: 'flex', gap: '16px' }}>
              <input 
                type="text" 
                autoComplete="off"
                placeholder="Type your reply..." 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{ flex: 1, padding: '18px 24px', borderRadius: '18px', border: '2px solid #f1f5f9', outline: 'none', fontSize: '15px', fontWeight: 500, transition: 'all 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
                onBlur={(e) => e.target.style.borderColor = '#f1f5f9'}
              />
              <button 
                type="submit" 
                disabled={submitting || !replyText.trim()}
                style={{ 
                  padding: '0 32px', borderRadius: '18px', border: 'none', 
                  background: '#0ea5e9', color: '#fff', fontWeight: '900', 
                  cursor: 'pointer', transition: 'all 0.3s',
                  boxShadow: '0 10px 20px rgba(14, 165, 233, 0.3)',
                  opacity: (submitting || !replyText.trim()) ? 0.6 : 1,
                  fontSize: '15px'
                }}
              >
                {submitting ? "..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>
        {`
          .dashboard-container { animation: fadeIn 0.8s ease-out; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .table-row-hover:hover { background: #fdfdfd !important; transform: scale(1.002); box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
          .loader { border: 4px solid #f3f3f3; border-top: 4px solid #0ea5e9; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}
      </style>
    </div>
  );
};

export default Inquiries;
