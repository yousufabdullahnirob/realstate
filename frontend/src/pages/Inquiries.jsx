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

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading Inquiries...</div>;

  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header">
          <h2>Customer Inquiries</h2>
          <button className="add-btn">Export CSV</button>
        </div>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User Email</th>
                <th>Apartment</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map(inquiry => (
                <tr key={inquiry.id}>
                  <td>{inquiry.id}</td>
                  <td>{inquiry.user_email}</td>
                  <td>{inquiry.apartment_title}</td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {inquiry.message}
                  </td>
                  <td>{new Date(inquiry.created_at).toLocaleDateString()}</td>
                  <td><span className={`status ${inquiry.status}`}>{inquiry.status.toUpperCase()}</span></td>
                  <td>
                    <button className="edit-btn">Reply</button>
                    <button className="delete-btn">Archive</button>
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No inquiries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inquiries;

