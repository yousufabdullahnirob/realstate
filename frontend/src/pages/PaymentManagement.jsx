import React, { useEffect, useState, useCallback } from "react";
import "../admin.css";
import apiProxy from "../utils/proxyClient";
import { formatBDT } from "../utils/formatters";

const Badge = ({ status }) => {
  const map = {
    pending:  { bg: '#fef3c7', border: '#f59e0b', color: '#92400e' },
    verified: { bg: '#d1fae5', border: '#10b981', color: '#065f46' },
    rejected: { bg: '#fee2e2', border: '#ef4444', color: '#991b1b' },
    success:  { bg: '#d1fae5', border: '#10b981', color: '#065f46' },
    failed:   { bg: '#fee2e2', border: '#ef4444', color: '#991b1b' },
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

const PaymentManagement = () => {
  const [allPayments, setAllPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');  // all | pending | verified | rejected
  const [search, setSearch] = useState('');
  const [verifyingId, setVerifyingId] = useState(null);
  const [modalPayment, setModalPayment] = useState(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the correct endpoint - returns payments for current user (admin sees all via MyPaymentsView)
      const data = await apiProxy.get("/payments/my/");
      setAllPayments(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const handleVerify = async (id, status) => {
    setVerifyingId(id);
    try {
      await apiProxy.post(`/payments/${id}/verify/`, { status });
      setAllPayments(prev => prev.map(p => p.id === id ? { ...p, verification_status: status } : p));
      if (modalPayment?.id === id) setModalPayment(prev => ({ ...prev, verification_status: status }));
    } catch (e) {
      alert("Failed to update payment: " + e.message);
    } finally {
      setVerifyingId(null);
    }
  };

  const formatDate = (dt) => dt
    ? new Date(dt).toLocaleString('en-BD', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';

  // Filter + search
  const filtered = allPayments.filter(p => {
    const matchFilter = filter === 'all' || p.verification_status === filter;
    const matchSearch = !search || 
      p.transaction_id?.toLowerCase().includes(search.toLowerCase()) ||
      String(p.id).includes(search);
    return matchFilter && matchSearch;
  });

  // Stats summary
  const pendingCount  = allPayments.filter(p => p.verification_status === 'pending').length;
  const verifiedCount = allPayments.filter(p => p.verification_status === 'verified').length;
  const rejectedCount = allPayments.filter(p => p.verification_status === 'rejected').length;
  const totalVerifiedAmount = allPayments
    .filter(p => p.verification_status === 'verified')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: -0.5 }}>Payment Management</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, marginTop: 4 }}>Verify and manage customer payments</p>
        </div>
        <button onClick={fetchPayments} style={{
          background: 'var(--primary)', color: 'white', border: 'none',
          padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer'
        }}>↻ Refresh</button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Total Payments', value: allPayments.length, color: '#0ea5e9', icon: '💳' },
          { label: 'Pending',        value: pendingCount,        color: '#f59e0b', icon: '⏳' },
          { label: 'Verified',       value: verifiedCount,       color: '#10b981', icon: '✅' },
          { label: 'Total Verified', value: formatBDT(totalVerifiedAmount), color: '#8b5cf6', icon: '💰' },
        ].map(card => (
          <div key={card.label} className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: 8,
              background: `${card.color}18`, border: `1.5px solid ${card.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
            }}>{card.icon}</div>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{card.label}</p>
            <p style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: -0.5 }}>{card.value}</p>
            <div style={{ position: 'absolute', bottom: 0, left: 0, height: 3, width: '40%', background: card.color, borderRadius: '0 4px 0 0' }} />
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', 'pending', 'verified', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s',
                background: filter === f ? 'var(--primary)' : 'var(--bg-card)',
                color: filter === f ? 'white' : 'var(--text-secondary)',
                border: `1.5px solid ${filter === f ? 'var(--primary)' : 'var(--border-color)'}`,
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'pending' && pendingCount > 0 && (
                <span style={{ marginLeft: 6, background: '#f59e0b', color: 'white', borderRadius: 10, padding: '1px 6px', fontSize: 10 }}>{pendingCount}</span>
              )}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by Transaction ID or Payment ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 200, padding: '9px 14px', borderRadius: 8, fontSize: 13,
            border: '1.5px solid var(--border-color)', outline: 'none',
            background: 'var(--bg-card)', color: 'var(--text-primary)', fontWeight: 500
          }}
        />
        {(filter !== 'all' || search) && (
          <button onClick={() => { setFilter('all'); setSearch(''); }} style={{
            padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: 'var(--secondary)', border: '1.5px solid var(--border-color)',
            color: 'var(--text-muted)', cursor: 'pointer'
          }}>Clear</button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: 12, padding: '12px 16px' }}>
          <p style={{ color: '#991b1b', fontWeight: 700, fontSize: 13 }}>⚠️ {error}</p>
        </div>
      )}

      {/* Payments Table */}
      <section className="preview-section glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>
            {filter === 'all' ? 'All Payments' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Payments`}
            <span style={{ marginLeft: 8, color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>({filtered.length})</span>
          </h3>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div style={{ width: 32, height: 32, border: '3px solid var(--border-color)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <p style={{ fontWeight: 600 }}>Loading payments...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>💳</div>
            <p style={{ fontWeight: 700, fontSize: 16 }}>No payments found</p>
            <p style={{ fontSize: 13, marginTop: 6 }}>Try changing your filter or search term</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Booking</th>
                  <th>Amount</th>
                  <th>Transaction ID</th>
                  <th>Gateway</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Verification</th>
                  <th>Proof</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(pay => (
                  <tr
                    key={pay.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setModalPayment(pay)}
                  >
                    <td style={{ fontWeight: 700 }}>#{pay.id}</td>
                    <td style={{ fontWeight: 600 }}>#{pay.booking}</td>
                    <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{formatBDT(pay.amount)}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{pay.transaction_id}</td>
                    <td style={{ fontSize: 12 }}>{pay.payment_gateway || 'Manual'}</td>
                    <td style={{ fontSize: 12 }}>{formatDate(pay.payment_date)}</td>
                    <td><Badge status={pay.payment_status} /></td>
                    <td><Badge status={pay.verification_status} /></td>
                    <td onClick={e => e.stopPropagation()}>
                      {pay.payment_proof_image
                        ? <a href={pay.payment_proof_image} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 12 }}>📎 View</a>
                        : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>}
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      {pay.verification_status === 'pending' ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="approve-btn"
                            onClick={() => handleVerify(pay.id, 'verified')}
                            disabled={verifyingId === pay.id}
                            style={{ fontSize: 11, padding: '4px 10px', opacity: verifyingId === pay.id ? 0.6 : 1 }}
                          >✓</button>
                          <button
                            className="delete-btn"
                            onClick={() => handleVerify(pay.id, 'rejected')}
                            disabled={verifyingId === pay.id}
                            style={{ fontSize: 11, padding: '4px 10px', opacity: verifyingId === pay.id ? 0.6 : 1 }}
                          >✕</button>
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Payment Detail Modal */}
      {modalPayment && (
        <div
          className="modal-overlay active"
          onClick={() => setModalPayment(null)}
        >
          <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800 }}>Payment #{modalPayment.id}</h3>
              <button onClick={() => setModalPayment(null)} style={{
                background: 'var(--secondary)', border: '1.5px solid var(--border-color)',
                borderRadius: 8, padding: '6px 12px', fontWeight: 700, cursor: 'pointer', fontSize: 13
              }}>✕ Close</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['Booking ID', `#${modalPayment.booking}`],
                ['Amount', formatBDT(modalPayment.amount)],
                ['Transaction ID', modalPayment.transaction_id],
                ['Gateway', modalPayment.payment_gateway || 'Manual/Proof'],
                ['Date', formatDate(modalPayment.payment_date)],
                ['Payment Status', null],
                ['Verification Status', null],
              ].map(([label, value], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--secondary)', borderRadius: 8, border: '1.5px solid var(--border-color)' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>{label}</span>
                  {label === 'Payment Status' ? <Badge status={modalPayment.payment_status} />
                  : label === 'Verification Status' ? <Badge status={modalPayment.verification_status} />
                  : <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>}
                </div>
              ))}

              {modalPayment.payment_proof_image && (
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Payment Proof</p>
                  <a href={modalPayment.payment_proof_image} target="_blank" rel="noreferrer">
                    <img src={modalPayment.payment_proof_image} alt="Payment proof" style={{ width: '100%', borderRadius: 8, border: '1.5px solid var(--border-color)' }} onError={e => { e.target.style.display = 'none'; }} />
                  </a>
                </div>
              )}
            </div>

            {modalPayment.verification_status === 'pending' && (
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button
                  className="approve-btn"
                  onClick={() => handleVerify(modalPayment.id, 'verified')}
                  disabled={verifyingId === modalPayment.id}
                  style={{ flex: 1, padding: '12px', fontSize: 14, opacity: verifyingId === modalPayment.id ? 0.6 : 1 }}
                >✓ Verify Payment</button>
                <button
                  className="delete-btn"
                  onClick={() => handleVerify(modalPayment.id, 'rejected')}
                  disabled={verifyingId === modalPayment.id}
                  style={{ flex: 1, padding: '12px', fontSize: 14, opacity: verifyingId === modalPayment.id ? 0.6 : 1 }}
                >✕ Reject Payment</button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default PaymentManagement;
