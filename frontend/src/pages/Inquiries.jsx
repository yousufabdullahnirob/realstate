import React, { useEffect, useState } from 'react';
import apiProxy from '../utils/proxyClient';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const data = await apiProxy.get("/admin/inquiries/");
        setInquiries(data);
      } catch (error) {
        console.error("Inquiries fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
      try {
          const updated = await apiProxy.patch(`/admin/inquiries/${id}/`, { status: newStatus });
          setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status: updated.status } : inq));
      } catch (error) {
          console.error("Failed to update status:", error);
          alert("Failed to update status.");
      }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Inquiries...</div>;

  return (
    <div className="dashboard-container">
      <div className="section-header" style={{ marginBottom: '32px' }}>
        <h2>Customer Inquiries</h2>
        <button className="add-btn">Export CSV</button>
      </div>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User Email</th>
              <th>Apartment</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map(inquiry => (
              <tr key={inquiry.id}>
                <td style={{ color: 'var(--text-muted)' }}>#{inquiry.id}</td>
                <td style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{inquiry.user_email}</td>
                <td>{inquiry.apartment_title}</td>
                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {inquiry.message}
                </td>
                <td>{new Date(inquiry.created_at).toLocaleDateString()}</td>
                <td>
                    <select 
                        value={inquiry.status} 
                        onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="new">NEW</option>
                        <option value="contacted">CONTACTED</option>
                        <option value="closed">CLOSED</option>
                    </select>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="edit-btn">View</button>
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
    </div>
  );
};

export default Inquiries;

