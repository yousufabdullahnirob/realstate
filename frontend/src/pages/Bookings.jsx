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
    if (!window.confirm('Approve this booking?')) return;
    try {
      await apiProxy.post(`/admin/bookings/${bookingId}/approve/`);
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'confirmed', is_locked: true } : b
      ));
      alert('Booking approved and locked!');
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  const handleReject = async (bookingId) => {
    if (!window.confirm('Reject this booking?')) return;
    try {
      await apiProxy.post(`/admin/bookings/${bookingId}/reject/`);
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      ));
      alert('Booking rejected!');
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  const handleSetDueDate = async (bookingId) => {
    if (!dueDate[bookingId]) {
      alert('Please select a due date');
      return;
    }
    try {
      await apiProxy.post(`/admin/bookings/${bookingId}/set-due-date/`, {
        final_payment_due_date: dueDate[bookingId]
      });
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, final_payment_due_date: dueDate[bookingId] } : b
      ));
      setShowDueDateForm(prev => ({ ...prev, [bookingId]: false }));
      setDueDate(prev => ({ ...prev, [bookingId]: '' }));
      alert('Due date set successfully!');
    } catch (e) {
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
    try {
      window.location.href = `/api/admin/export/${reportType}/`;
    } catch (e) {
      alert('Export failed: ' + e.message);
    }
  };

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Bookings Management</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => handleExport('bookings')}
              style={{ background: '#0ea5e9', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
            >
              📥 Export Bookings
            </button>
            <button 
              onClick={() => handleExport('sales')}
              style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
            >
              📥 Export Sales
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
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            <button 
                              onClick={() => handleApprove(b.id)}
                              style={{ background: '#10b981', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}
                            >
                              ✅ Approve
                            </button>
                            <button 
                              onClick={() => handleReject(b.id)}
                              style={{ background: '#ef4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}
                            >
                              ❌ Reject
                            </button>
                            <button 
                              onClick={() => setShowDueDateForm(prev => ({ ...prev, [b.id]: !prev[b.id] }))}
                              style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px' }}
                            >
                              📅 Due Date
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
import React, { useState, useEffect } from 'react';
import apiProxy from '../utils/proxyClient';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    if (!window.confirm('Approve this booking?')) return;
    try {
      await apiProxy.post(`/admin/bookings/${bookingId}/approve/`);
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'confirmed' } : b
      ));
      alert('Booking approved!');
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  const handleReject = async (bookingId) => {
    if (!window.confirm('Reject this booking?')) return;
    try {
      await apiProxy.post(`/admin/bookings/${bookingId}/reject/`);
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      ));
      alert('Booking rejected!');
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header">
          <h2>Bookings Management</h2>
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
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center' }}>No bookings found.</td></tr>
                ) : bookings.map(b => (
                  <tr key={b.id}>
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
                    <td><span className={`status ${statusColor(b.status)}`}>{b.status?.toUpperCase()}</span></td>
                    <td>
                      {b.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => handleApprove(b.id)}
                            style={{ background: '#10b981', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleReject(b.id)}
                            style={{ background: '#ef4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
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
