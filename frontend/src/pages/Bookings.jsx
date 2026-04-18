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
