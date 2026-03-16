import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';
const ENABLE_BACKEND_SYNC = true;

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const demoInquiries = [
  { id: 1, name: 'Rahim Khan', email: 'rahim@email.com', project: 'Skyline Residency', apartment: 'Apt 5A', date: '2024-10-15', status: 'new' },
  { id: 2, name: 'Fatema Begum', email: 'fatema@email.com', project: 'Mahim Heights', apartment: 'Apt 3B', date: '2024-10-16', status: 'contacted' },
  { id: 3, name: 'Karim Ahmed', email: 'karim@email.com', project: 'Green Valley', apartment: 'Apt-None', date: '2024-10-17', status: 'new' },
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
        const response = await axios.get(`${API_BASE}/api/admin/inquiries/`, { headers: getAuthHeader() });
        if (!isMounted) {
          return;
        }

        const mapped = (Array.isArray(response.data) ? response.data : []).map((inquiry) => ({
          id: inquiry.id,
          name: inquiry.user_name,
          email: inquiry.user_email,
          project: inquiry.project_name || 'N/A',
          apartment: inquiry.apartment_title || 'N/A',
          date: new Date(inquiry.created_at).toLocaleDateString(),
          status: inquiry.status,
        }));
        setInquiries(mapped);
      } catch {
        // keep demo fallback
      }
    };

    loadInquiries();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleExportCsv = () => {
    const header = ['ID', 'Name', 'Email', 'Project', 'Apartment', 'Date', 'Status'];
    const rows = inquiries.map((inquiry) => [
      inquiry.id,
      inquiry.name,
      inquiry.email,
      inquiry.project,
      inquiry.apartment,
      inquiry.date,
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
    const subject = encodeURIComponent(`Regarding your inquiry (${inquiry.project})`);
    const body = encodeURIComponent(`Hello ${inquiry.name},\n\nThank you for your inquiry about ${inquiry.project}.`);
    window.location.href = `mailto:${inquiry.email}?subject=${subject}&body=${body}`;
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
                <th>Name</th>
                <th>Email</th>
                <th>Project</th>
                <th>Apartment</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(inquiry => (
                <tr key={inquiry.id}>
                  <td>{inquiry.id}</td>
                  <td>{inquiry.name}</td>
                  <td>{inquiry.email}</td>
                  <td>{inquiry.project}</td>
                  <td>{inquiry.apartment}</td>
                  <td>{inquiry.date}</td>
                  <td><span className={`status ${inquiry.status}`}>{inquiry.status.toUpperCase()}</span></td>
                  <td>
                    <div className="row-actions">
                      <button className="edit-btn" onClick={() => handleReply(inquiry)}>Reply</button>
                      <button className="delete-btn" onClick={() => handleArchive(inquiry)}>Archive</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inquiries;
