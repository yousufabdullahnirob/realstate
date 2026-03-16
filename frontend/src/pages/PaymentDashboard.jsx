import React, { useMemo, useState } from "react";
import SubmitPayment from "./SubmitPayment";

const DEMO_BOOKINGS = [
  { id: 1, booking_reference: "BK-001", apartment_title: "Green Valley Unit 101", advance_amount: "75000", status: "pending" },
  { id: 2, booking_reference: "BK-002", apartment_title: "Lake View Unit 203", advance_amount: "120000", status: "confirmed" },
];

const DEMO_PAYMENTS = [
  { id: 1, booking_reference: "BK-001", amount: "75000", payment_status: "pending", payment_date: "2026-03-10T09:30:00", payment_gateway: "bKash", transaction_id: "TXN-8821" },
  { id: 2, booking_reference: "BK-002", amount: "120000", payment_status: "success", payment_date: "2026-03-11T11:00:00", payment_gateway: "SSLCommerz", transaction_id: "TXN-9934" },
];

const maskTransactionId = (value) => {
  if (!value) return "--";
  if (value.length <= 4) return "••••";
  return `${"•".repeat(Math.max(value.length - 4, 4))}${value.slice(-4)}`;
};

const getDisplayStatus = (status) => {
  if (status === "success") return "Verified";
  if (status === "failed") return "Rejected";
  return "Pending Verification";
};

const PaymentDashboard = () => {
  const [payments, setPayments] = useState(DEMO_PAYMENTS);
  const [bookings] = useState(DEMO_BOOKINGS);
  const [selectedBookingId, setSelectedBookingId] = useState(String(DEMO_BOOKINGS[0].id));

  const selectedBooking = useMemo(
    () => bookings.find((booking) => String(booking.id) === selectedBookingId),
    [bookings, selectedBookingId]
  );

  return (
    <div className="user-table-container">
      <h2>My Payments</h2>
      <div className="payment-security-note">
        Submit payments for your booking and wait for admin verification.
      </div>

      {bookings.length > 0 && (
        <div className="payment-booking-picker">
          <label htmlFor="booking-selector">Booking for payment</label>
          <select
            id="booking-selector"
            className="payment-select"
            value={selectedBookingId}
            onChange={(event) => setSelectedBookingId(event.target.value)}
          >
            {bookings.map((booking) => (
              <option key={booking.id} value={booking.id}>
                {booking.booking_reference} | {booking.apartment_title} | Advance ৳ {Number(booking.advance_amount || 0).toLocaleString()}
              </option>
            ))}
          </select>
        </div>
      )}

      <SubmitPayment
        bookingId={selectedBookingId ? Number(selectedBookingId) : null}
        bookingReference={selectedBooking?.booking_reference}
        maxAmount={selectedBooking?.advance_amount}
        disabled={!selectedBookingId}
        onDemoSubmit={(payment) => setPayments((previous) => [payment, ...previous])}
      />

      <table className="user-table">
        <thead>
          <tr>
            <th>Booking Ref</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Gateway</th>
            <th>Transaction ID</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.booking_reference || payment.booking}</td>
              <td>৳ {Number(payment.amount || 0).toLocaleString()}</td>
              <td>{getDisplayStatus(payment.payment_status)}</td>
              <td>{new Date(payment.payment_date).toLocaleString()}</td>
              <td>{payment.payment_gateway}</td>
              <td>{maskTransactionId(payment.transaction_id)}</td>
            </tr>
          ))}
          {payments.length === 0 && (
            <tr>
              <td colSpan="6" className="payment-empty-row">No payment records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentDashboard;
