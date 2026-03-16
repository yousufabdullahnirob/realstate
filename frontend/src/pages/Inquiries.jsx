import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';
const ENABLE_BACKEND_SYNC = true;

const getAuthHeader = () => {
  const token = localStorage.getItem('access') || localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const demoInquiries = [
  { id: 1, user_email: 'rahim@email.com', apartment_title: 'Apt 5A', message: 'Interested in the payment plan details.', created_at: '2024-10-15T00:00:00Z', status: 'new' },
  { id: 2, user_email: 'fatema@email.com', apartment_title: 'Apt 3B', message: 'Can I schedule a site visit this week?', created_at: '2024-10-16T00:00:00Z', status: 'contacted' },
  { id: 3, user_email: 'karim@email.com', apartment_title: 'Apt 9C', message: 'Please share floor plan and booking steps.', created_at: '2024-10-17T00:00:00Z', status: 'new' },
];

const Inquiries = () => {
  const [inquiries, setInquiries] = useState(demoInquiries);

  useEffect(() => {
    if (!ENABLE_BACKEND_SYNC) {
      return;
    }

    let isMounted = true;

    const loadInquiries = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/inquiries/`, { headers: getAuthHeader() });
        if (!isMounted) {
          return;
        }

        const mapped = (Array.isArray(response.data) ? response.data : []).map((inquiry) => ({
          id: inquiry.id,
          user_email: inquiry.user_email || 'N/A',
          apartment_title: inquiry.apartment_title || 'N/A',
          message: inquiry.message || '—',
          created_at: inquiry.created_at,
          status: inquiry.status || 'new',
        }));
        setInquiries(mapped.length > 0 ? mapped : demoInquiries);
      } catch {
        if (isMounted) {
          setInquiries(demoInquiries);
        }
      }
    };

    loadInquiries();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleExportCsv = () => {
    const header = ['ID', 'User Email', 'Apartment', 'Message', 'Date', 'Status'];
    const rows = inquiries.map((inquiry) => [
      inquiry.id,
      inquiry.user_email,
      inquiry.apartment_title,
      inquiry.message,
      new Date(inquiry.created_at).toLocaleDateString(),
      inquiry.status.toUpperCase(),
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'inquiries.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    window.alert('CSV export completed.');
  };

  const handleReply = (inquiry) => {
    const subject = encodeURIComponent(`Regarding your inquiry (${inquiry.apartment_title})`);
    const body = encodeURIComponent(`Hello,\n\nThank you for your inquiry about ${inquiry.apartment_title}.`);
    window.location.href = `mailto:${inquiry.user_email}?subject=${subject}&body=${body}`;
  };

  const handleArchive = async (inquiry) => {
    if (ENABLE_BACKEND_SYNC) {
      try {
        await axios.patch(`${API_BASE}/api/admin/inquiries/${inquiry.id}/`, { status: 'closed' }, { headers: getAuthHeader() });
      } catch {
        // ignore and still update UI
      }
    }

    setInquiries((previous) => previous.map((item) => (
      item.id === inquiry.id ? { ...item, status: 'closed' } : item
    )));
  };

  const rows = useMemo(() => inquiries, [inquiries]);

  return (
    <div className="page-content">
      <div className="admin-page-shell">
        <div className="page-header">
          <h2>Customer Inquiries</h2>
          <button className="add-btn" onClick={handleExportCsv}>Export CSV</button>
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
              {rows.map(inquiry => (
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
                    <div className="row-actions">
                      <button className="edit-btn" onClick={() => handleReply(inquiry)}>Reply</button>
                      <button className="delete-btn" onClick={() => handleArchive(inquiry)}>Archive</button>
                    </div>
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
