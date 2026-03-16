import React, { useState } from "react";

const allowedGateways = ["SSLCommerz", "bKash", "Nagad"];

const SubmitPayment = ({ bookingId, bookingReference, maxAmount, onSuccess, disabled = false, onDemoSubmit }) => {
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [gateway, setGateway] = useState("SSLCommerz");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleTransactionChange = (event) => {
    const nextValue = event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 100);
    setTransactionId(nextValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!bookingId || disabled) {
      setError("Select one of your valid bookings before submitting payment.");
      return;
    }

    const numericAmount = Number(amount);
    const cleanedTransactionId = transactionId.trim().toUpperCase();

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Enter a valid amount greater than zero.");
      return;
    }

    if (maxAmount && numericAmount > Number(maxAmount)) {
      setError(`Amount cannot exceed the required advance amount of ৳ ${Number(maxAmount).toLocaleString()}.`);
      return;
    }

    if (!/^[A-Z0-9-]{6,100}$/.test(cleanedTransactionId)) {
      setError("Transaction ID must be 6-100 characters and use only letters, numbers, and hyphens.");
      return;
    }

    if (!allowedGateways.includes(gateway)) {
      setError("Choose a supported payment gateway.");
      return;
    }

    setSubmitting(true);

    const demoPayment = {
      id: Date.now(),
      booking_reference: bookingReference || `BK-${bookingId}`,
      amount: numericAmount.toFixed(2),
      payment_status: "pending",
      payment_date: new Date().toISOString(),
      payment_gateway: gateway,
      transaction_id: cleanedTransactionId,
    };

    if (onDemoSubmit) {
      onDemoSubmit(demoPayment);
    }

    setSuccess(true);
    setAmount("");
    setTransactionId("");
    setSubmitting(false);

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <h3>Submit Payment</h3>
      <p className="payment-form-note">
        Submit your payment details. Admin will review and update verification status.
      </p>
      <label>Amount</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
        disabled={submitting || disabled}
      />
      <label>Transaction ID</label>
      <input
        type="text"
        value={transactionId}
        onChange={handleTransactionChange}
        required
        autoComplete="off"
        spellCheck="false"
        disabled={submitting || disabled}
      />
      <label>Gateway</label>
      <select value={gateway} onChange={e => setGateway(e.target.value)} disabled={submitting || disabled}>
        <option value="SSLCommerz">SSLCommerz</option>
        <option value="bKash">bKash</option>
        <option value="Nagad">Nagad</option>
      </select>
      <button type="submit" disabled={submitting || disabled}>{submitting ? "Submitting..." : "Submit"}</button>
      {success && <div className="success-msg">Payment submitted successfully. It now requires admin verification.</div>}
      {error && <div className="error-msg">{error}</div>}
    </form>
  );
};

export default SubmitPayment;
