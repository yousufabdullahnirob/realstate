import React from 'react';

const mockInquiries = [
  { id: 1, name: 'Rahim Khan', email: 'rahim@email.com', project: 'Skyline Residency', apartment: 'Apt 5A', date: '2024-10-15', status: 'new' },
  { id: 2, name: 'Fatema Begum', email: 'fatema@email.com', project: 'Mahim Heights', apartment: 'Apt 3B', date: '2024-10-16', status: 'contacted' },
  { id: 3, name: 'Karim Ahmed', email: 'karim@email.com', project: 'Green Valley', apartment: 'Apt-None', date: '2024-10-17', status: 'new' },
];

const Inquiries = () => {
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
              {mockInquiries.map(inquiry => (
                <tr key={inquiry.id}>
                  <td>{inquiry.id}</td>
                  <td>{inquiry.name}</td>
                  <td>{inquiry.email}</td>
                  <td>{inquiry.project}</td>
                  <td>{inquiry.apartment}</td>
                  <td>{inquiry.date}</td>
                  <td><span className={`status ${inquiry.status}`}>{inquiry.status.toUpperCase()}</span></td>
                  <td>
                    <button className="edit-btn">Reply</button>
                    <button className="delete-btn">Archive</button>
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

