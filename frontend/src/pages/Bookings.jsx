import React, { useState, useEffect } from 'react';
import apiProxy from '../utils/proxyClient';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await apiProxy.get("/admin/bookings/");
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

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
                <th>Booking Ref</th>
                <th>Apartment</th>
                <th>Tenant</th>
                <th>Booking Date</th>
                <th>Total Installments</th>
                <th>Status</th>
                <th>Advance Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="8" style={{textAlign:'center'}}>Loading...</td></tr> : bookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.booking_reference}</td>
                  <td>{booking.apartment_title}</td>
                  <td>{booking.user_email}</td>
                  <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
                  <td>{booking.installments?.length || 0}</td>
                  <td><span className={`status ${booking.status}`}>{booking.status.toUpperCase()}</span></td>
                  <td>BDT {booking.advance_amount}</td>
                  <td>
                    <button className="edit-btn">View</button>
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

