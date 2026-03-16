import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import '../admin.css';

const API_BASE = 'http://localhost:8000';

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const DEMO_BOOKINGS = [
  { id: 1, booking_reference: 'BK-DEMO001', apartment: 1, apartment_title: 'Apt 5A', user: 1, tenant_name: 'Sarah Rahman', tenant_email: 'sarah@example.com', booking_date: '2024-01-15T00:00:00Z', status: 'confirmed', advance_amount: '15000.00' },
  { id: 2, booking_reference: 'BK-DEMO002', apartment: 2, apartment_title: 'Apt 3B', user: 2, tenant_name: 'Ahmed Karim', tenant_email: 'ahmed@example.com', booking_date: '2024-02-01T00:00:00Z', status: 'confirmed', advance_amount: '12000.00' },
  { id: 3, booking_reference: 'BK-DEMO003', apartment: 3, apartment_title: 'Apt 7C', user: 3, tenant_name: 'Nusrat Jahan', tenant_email: 'nusrat@example.com', booking_date: '2024-03-10T00:00:00Z', status: 'pending', advance_amount: '18000.00' },
];

const EMPTY_FORM = { apartment: '', user: '', status: 'pending', advance_amount: '' };

const Bookings = () => {
  const [bookings, setBookings] = useState(DEMO_BOOKINGS);
  const [apartments, setApartments] = useState([]);
  const [modalType, setModalType] = useState('');
  const [current, setCurrent] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/api/admin/bookings/`, { headers: getAuthHeader() })
      .then(res => { if (res.data && res.data.length) setBookings(res.data); })
      .catch(() => {});
    axios.get(`${API_BASE}/api/apartments/`, { headers: getAuthHeader() })
      .then(res => { if (res.data && res.data.length) setApartments(res.data); })
      .catch(() => {});
  }, []);

  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setApiError('');
    setModalType('add');
  };

  const openEdit = (b) => {
    setCurrent(b);
    setFormData({ apartment: b.apartment, user: b.user, status: b.status, advance_amount: b.advance_amount });
    setApiError('');
    setModalType('edit');
  };

  const openDelete = (b) => {
    setCurrent(b);
    setApiError('');
    setModalType('delete');
  };

  const closeModal = () => { setModalType(''); setApiError(''); setCurrent(null); };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setApiError('');
    try {
      const payload = {
        apartment: Number(formData.apartment),
        user: Number(formData.user),
        status: formData.status,
        advance_amount: formData.advance_amount,
      };
      if (modalType === 'add') {
        const res = await axios.post(`${API_BASE}/api/admin/bookings/`, payload, { headers: getAuthHeader() });
        setBookings(prev => [res.data, ...prev]);
      } else {
        const res = await axios.patch(`${API_BASE}/api/admin/bookings/${current.id}/`, payload, { headers: getAuthHeader() });
        setBookings(prev => prev.map(b => b.id === current.id ? res.data : b));
      }
      closeModal();
    } catch (err) {
      const detail = err.response?.data;
      setApiError(typeof detail === 'object' ? JSON.stringify(detail) : String(detail || 'Save failed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    setApiError('');
    try {
      await axios.delete(`${API_BASE}/api/admin/bookings/${current.id}/`, { headers: getAuthHeader() });
      setBookings(prev => prev.filter(b => b.id !== current.id));
      closeModal();
    } catch (err) {
      const detail = err.response?.data;
      setApiError(typeof detail === 'object' ? JSON.stringify(detail) : String(detail || 'Delete failed'));
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString() : '—';

  const modal = modalType ? createPortal(
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal-box booking-modal">
        {(modalType === 'add' || modalType === 'edit') && (
          <>
            <h3>{modalType === 'add' ? 'New Booking' : 'Edit Booking'}</h3>
            {apiError && <div className="form-error">{apiError}</div>}
            <div className="booking-form">
              <div className="booking-form-field">
                <label htmlFor="booking-apartment">Apartment</label>
                {apartments.length > 0 ? (
                  <select id="booking-apartment" className="form-select" name="apartment" value={formData.apartment} onChange={handleChange}>
                    <option value="">Select apartment</option>
                    {apartments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                  </select>
                ) : (
                  <input id="booking-apartment" className="form-input" type="number" name="apartment" placeholder="Apartment ID" value={formData.apartment} onChange={handleChange} />
                )}
              </div>
              <div className="booking-form-row">
                <div className="booking-form-field">
                  <label htmlFor="booking-user">User ID</label>
                  <input id="booking-user" className="form-input" type="number" name="user" placeholder="User ID" value={formData.user} onChange={handleChange} />
                </div>
                <div className="booking-form-field">
                  <label htmlFor="booking-status">Status</label>
                  <select id="booking-status" className="form-select" name="status" value={formData.status} onChange={handleChange}>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="booking-form-field">
                <label htmlFor="booking-advance">Advance Amount</label>
                <input id="booking-advance" className="form-input" type="number" step="0.01" name="advance_amount" placeholder="e.g. 15000.00" value={formData.advance_amount} onChange={handleChange} />
              </div>
            </div>
            <div className="modal-actions">
              <button className="save-btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
              <button className="cancel-btn" onClick={closeModal} disabled={saving}>Cancel</button>
            </div>
          </>
        )}
        {modalType === 'delete' && (
          <>
            <h3>Delete Booking</h3>
            <p>Are you sure you want to delete booking <strong>{current?.booking_reference}</strong>? This cannot be undone.</p>
            {apiError && <div className="form-error">{apiError}</div>}
            <div className="modal-actions">
              <button className="delete-btn" onClick={handleDelete} disabled={saving}>{saving ? 'Deleting…' : 'Delete'}</button>
              <button className="cancel-btn" onClick={closeModal} disabled={saving}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div className="page-content">
      <div className="admin-page-shell">
        <div className="page-header">
          <h2>Bookings Management</h2>
          <button className="add-btn" onClick={openAdd}>+ New Booking</button>
        </div>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Apartment</th>
                <th>Tenant</th>
                <th>Booked On</th>
                <th>Status</th>
                <th>Advance (৳)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>{b.booking_reference}</td>
                  <td>{b.apartment_title || b.apartment}</td>
                  <td>
                    <div>{b.tenant_name || '—'}</div>
                    <small style={{ color: '#888' }}>{b.tenant_email || ''}</small>
                  </td>
                  <td>{formatDate(b.booking_date)}</td>
                  <td><span className={`status ${b.status}`}>{b.status.toUpperCase()}</span></td>
                  <td>{Number(b.advance_amount).toLocaleString()}</td>
                  <td>
                    <div className="row-actions">
                      <button className="edit-btn" onClick={() => openEdit(b)}>Edit</button>
                      <button className="delete-btn" onClick={() => openDelete(b)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modal}
    </div>
  );
};

export default Bookings;
