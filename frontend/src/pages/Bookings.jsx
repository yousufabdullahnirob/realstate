import React, { useState, useEffect } from 'react';
import apiProxy from '../utils/proxyClient';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dueDate, setDueDate] = useState({});
  const [cancelReason, setCancelReason] = useState({});
  const [showDueDateForm, setShowDueDateForm] = useState({});
  const [showCancelForm, setShowCancelForm] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiProxy.get('/admin/bookings/');
        setBookings(Array.isArray(data) ? data : (data.results || []));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statusColor = (s) => {
    if (s === 'confirmed') return 'active';
    if (s === 'cancelled') return 'inactive';
    return 'pending';
  };

  const handleApprove = async (bookingId) => {
    alert(`DEBUG: Processing Approval for ID ${bookingId}`);
    console.log(`[Admin] Approving Booking ID: ${bookingId}`);
    try {
      const response = await apiProxy.post(`/admin/bookings/${bookingId}/approve/`);
      console.log(`[Admin] Approve response:`, response);
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'confirmed', is_locked: true } : b
      ));
      alert('SUCCESS: Booking approved and locked!');
    } catch (e) {
      console.error(`[Admin] Approve failed:`, e);
      alert('Error: ' + e.message);
    }
  };

  const handleReject = async (bookingId) => {
    alert(`DEBUG: Processing Rejection for ID ${bookingId}`);
    console.log(`[Admin] Rejecting Booking ID: ${bookingId}`);
    try {
      const response = await apiProxy.post(`/admin/bookings/${bookingId}/reject/`);
      console.log(`[Admin] Reject response:`, response);
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      ));
      alert('SUCCESS: Booking rejected!');
    } catch (e) {
      console.error(`[Admin] Reject failed:`, e);
      alert('Error: ' + e.message);
    }
  };

  const handleSetDueDate = async (bookingId) => {
    if (!dueDate[bookingId]) {
      alert('Please select a due date');
      return;
    }
    console.log(`[Admin] Setting due date for Booking ID ${bookingId} to ${dueDate[bookingId]}`);
    try {
      const response = await apiProxy.post(`/admin/bookings/${bookingId}/set-due-date/`, {
        final_payment_due_date: dueDate[bookingId]
      });
      console.log(`[Admin] Due date response:`, response);
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, final_payment_due_date: dueDate[bookingId] } : b
      ));
      setShowDueDateForm(prev => ({ ...prev, [bookingId]: false }));
      setDueDate(prev => ({ ...prev, [bookingId]: '' }));
      alert('Due date set successfully!');
    } catch (e) {
      console.error(`[Admin] Due date error:`, e);
      alert('Error: ' + e.message);
    }
  };

  const handleForceCancelBooking = async (bookingId) => {
    if (!cancelReason[bookingId]) {
      alert('Please provide a cancellation reason');
      return;
    }
    try {
      await apiProxy.post(`/admin/bookings/${bookingId}/force-cancel/`, {
        reason: cancelReason[bookingId]
      });
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled', cancelled_by_admin: true } : b
      ));
      setShowCancelForm(prev => ({ ...prev, [bookingId]: false }));
      setCancelReason(prev => ({ ...prev, [bookingId]: '' }));
      alert('Booking cancelled by admin!');
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  const handleExport = async (reportType) => {
    alert(`Exporting ${reportType}... If you see this, the fix is active.`);
    try {
      const filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
      await apiProxy.download(`/admin/export/${reportType}/`, filename);
    } catch (e) {
      alert('Export failed: ' + e.message);
    }
  };

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fef2f2', padding: '10px', borderRadius: '8px', border: '2px solid #ef4444' }}>
          <h2>Bookings Management <span style={{ color: '#ef4444' }}>--- TESTING ACTIVE V3 ---</span></h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => handleExport('bookings')}
              style={{ background: '#0ea5e9', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
            >
              📥 EXPORT V2 (Bookings)
            </button>
            <button 
              onClick={() => handleExport('sales')}
              style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
            >
              📥 EXPORT V2 (Sales)
            </button>
          </div>
        </div>
        {loading && <p>Loading bookings...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {!loading && !error && (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Apartment</th>
                  <th>Tenant</th>
                  <th>Advance</th>
                  <th>Transaction ID</th>
                  <th>Payment Proof</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Locked</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan={10} style={{ textAlign: 'center' }}>No bookings found.</td></tr>
                ) : bookings.map(b => (
                  <React.Fragment key={b.id}>
                    <tr>
                      <td>{b.booking_reference}</td>
                      <td>{b.apartment_title || b.apartment}</td>
                      <td>{b.user_email || b.user}</td>
                      <td>৳{Number(b.advance_amount).toLocaleString()}</td>
                      <td>{b.transaction_id || '—'}</td>
                      <td>
                        {b.payment_proof ? (
                          <a href={b.payment_proof} target="_blank" rel="noopener noreferrer">
                            View Proof
                          </a>
                        ) : '—'}
                      </td>
                      <td>{b.final_payment_due_date ? new Date(b.final_payment_due_date).toLocaleDateString() : '—'}</td>
                      <td><span className={`status ${statusColor(b.status)}`}>{b.status?.toUpperCase()}</span></td>
                      <td>{b.is_locked ? '🔒 Yes' : 'No'}</td>
                      <td>
                        {b.status === 'pending' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', zIndex: 10 }}>
                              <button 
                                id={`approve-btn-${b.id}`}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleApprove(b.id); }}
                                style={{ 
                                  background: '#10b981', color: 'white', border: '2px solid #059669', 
                                  padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', 
                                  fontSize: '12px', fontWeight: '800', width: '100%',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                  position: 'relative', zIndex: 20
                                }}
                              >
                                APPROVE NOW
                              </button>
                              <button 
                                id={`reject-btn-${b.id}`}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleReject(b.id); }}
                                style={{ 
                                  background: '#ef4444', color: 'white', border: '2px solid #dc2626', 
                                  padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', 
                                  fontSize: '12px', fontWeight: '800', width: '100%',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                  position: 'relative', zIndex: 20
                                }}
                              >
                                REJECT NOW
                              </button>
                              <button 
                                id={`due-btn-${b.id}`}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDueDateForm(prev => ({ ...prev, [b.id]: !prev[b.id] })); }}
                                style={{ 
                                  background: '#f59e0b', color: 'white', border: '2px solid #d97706', 
                                  padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', 
                                  fontSize: '12px', fontWeight: '800', width: '100%',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                  position: 'relative', zIndex: 20
                                }}
                              >
                                SET DUE DATE
                              </button>
                            </div>
                        )}
                        {b.status === 'confirmed' && (
                          <button 
                            onClick={() => setShowCancelForm(prev => ({ ...prev, [b.id]: !prev[b.id] }))}
                            style={{ background: '#ef4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}
                          >
                            🚫 Force Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                    {showDueDateForm[b.id] && (
                      <tr>
                        <td colSpan={10} style={{ background: '#f0f9ff', padding: '12px' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <label style={{ fontWeight: 700 }}>Set Due Date:</label>
                            <input 
                              type="date" 
                              value={dueDate[b.id] || ''}
                              onChange={(e) => setDueDate(prev => ({ ...prev, [b.id]: e.target.value }))}
                              style={{ padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                            />
                            <button 
                              onClick={() => handleSetDueDate(b.id)}
                              style={{ background: '#10b981', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                            >
                              Save
                            </button>
                            <button 
                              onClick={() => setShowDueDateForm(prev => ({ ...prev, [b.id]: false }))}
                              style={{ background: '#cbd5e1', color: '#0f172a', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                    {showCancelForm[b.id] && (
                      <tr>
                        <td colSpan={10} style={{ background: '#fef2f2', padding: '12px' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <label style={{ fontWeight: 700 }}>Cancel Reason:</label>
                            <textarea 
                              value={cancelReason[b.id] || ''}
                              onChange={(e) => setCancelReason(prev => ({ ...prev, [b.id]: e.target.value }))}
                              placeholder="Enter reason for cancellation"
                              style={{ padding: '6px 8px', border: '1px solid #fecaca', borderRadius: '4px', flex: 1, minHeight: '40px' }}
                            />
                            <button 
                              onClick={() => handleForceCancelBooking(b.id)}
                              style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => setShowCancelForm(prev => ({ ...prev, [b.id]: false }))}
                              style={{ background: '#cbd5e1', color: '#0f172a', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              Close
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
