import React from 'react';

const mockBookings = [
  { id: 1, apartment: 'Apt 5A', tenant: 'Sarah Rahman', startDate: '2024-01-15', endDate: '2025-01-14', status: 'active', amount: '$15,000/yr' },
  { id: 2, apartment: 'Apt 3B', tenant: 'Ahmed Karim', startDate: '2024-02-01', endDate: '2024-12-31', status: 'active', amount: '$12,000/yr' },
  { id: 3, apartment: 'Apt 7C', tenant: 'Nusrat Jahan', startDate: '2024-03-10', endDate: '2025-03-09', status: 'pending', amount: '$18,000/yr' },
];

const Bookings = () => {
  return (
    <div className="page-content">
      <div className="container">
        <div className="page-header">
          <h2>Bookings Management</h2>
          <button className="add-btn">+ New Booking</button>
        </div>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Apartment</th>
                <th>Tenant</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockBookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.apartment}</td>
                  <td>{booking.tenant}</td>
                  <td>{booking.startDate}</td>
                  <td>{booking.endDate}</td>
                  <td><span className={`status ${booking.status}`}>{booking.status.toUpperCase()}</span></td>
                  <td>{booking.amount}</td>
                  <td>
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
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

export default Bookings;

