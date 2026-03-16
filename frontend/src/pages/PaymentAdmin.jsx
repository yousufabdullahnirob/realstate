import React, { useMemo, useState } from "react";

const statusColor = { success: "#16a34a", pending: "#d97706", failed: "#dc2626" };
const statusBg = { success: "#dcfce7", pending: "#fef3c7", failed: "#fee2e2" };
const allowedStatuses = new Set(["success", "failed"]);

const DEMO_PAYMENTS = [
  { id: 1, booking_reference: "BK-001", client_name: "Rahim Khan", amount: "75000", payment_status: "pending", payment_date: "2026-03-10T09:30:00", payment_gateway: "bKash", transaction_id: "TXN-8821" },
  { id: 2, booking_reference: "BK-002", client_name: "Nusrat Jahan", amount: "120000", payment_status: "success", payment_date: "2026-03-11T11:00:00", payment_gateway: "SSLCommerz", transaction_id: "TXN-9934" },
  { id: 3, booking_reference: "BK-003", client_name: "Karim Ahmed", amount: "55000", payment_status: "pending", payment_date: "2026-03-12T14:15:00", payment_gateway: "Nagad", transaction_id: "TXN-7723" },
  { id: 4, booking_reference: "BK-004", client_name: "Sumaiya Islam", amount: "200000", payment_status: "failed", payment_date: "2026-03-13T10:45:00", payment_gateway: "bKash", transaction_id: "TXN-6601" },
];

const maskTransactionId = (value) => {
  if (!value) return "--";
  if (value.length <= 4) return "••••";
  return `${"•".repeat(Math.max(value.length - 4, 4))}${value.slice(-4)}`;
};

const PaymentAdmin = () => {
  const [payments, setPayments] = useState(DEMO_PAYMENTS);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeActionId, setActiveActionId] = useState(null);

  const handleVerify = async (id, nextStatus) => {
    if (!allowedStatuses.has(nextStatus)) {
      return;
    }

    const confirmed = window.confirm(
      `Confirm that you want to mark this payment as ${nextStatus}?`
    );

    if (!confirmed) {
      return;
    }

    setActiveActionId(id);
    setPayments((previous) => previous.map((payment) => (
      payment.id === id ? { ...payment, payment_status: nextStatus } : payment
    )));
    if (selected?.id === id) {
      setSelected((previous) => previous ? { ...previous, payment_status: nextStatus } : previous);
    }
    setActiveActionId(null);
  };

  const filtered = useMemo(
    () => (filterStatus === "all" ? payments : payments.filter((payment) => payment.payment_status === filterStatus)),
    [filterStatus, payments]
  );

  const stats = useMemo(() => ({
    total: payments.length,
    success: payments.filter((payment) => payment.payment_status === "success").length,
    pending: payments.filter((payment) => payment.payment_status === "pending").length,
    failed: payments.filter((payment) => payment.payment_status === "failed").length,
  }), [payments]);

  return (
    <div className="admin-page-shell">
      <div className="page-header">
        <h2>Payment Management</h2>
      </div>

      <div className="action-note">
        Demo payment mode active. Admin can mark payment status from this screen.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
        {[
          { label: "Total", value: stats.total, color: "#1D4153", bg: "#e8f0f5" },
          { label: "Verified", value: stats.success, color: "#166534", bg: "#dcfce7" },
          { label: "Pending", value: stats.pending, color: "#92400e", bg: "#fef3c7" },
          { label: "Failed", value: stats.failed, color: "#991b1b", bg: "#fee2e2" },
        ].map((item) => (
          <div key={item.label} style={{ background: item.bg, borderRadius: 12, padding: "14px 18px" }}>
            <div style={{ fontSize: 12, color: item.color, fontWeight: 700, marginBottom: 4 }}>{item.label.toUpperCase()}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: item.color }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {["all", "pending", "success", "failed"].map((filterValue) => (
          <button
            key={filterValue}
            onClick={() => setFilterStatus(filterValue)}
            style={{
              padding: "7px 18px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 13,
              background: filterStatus === filterValue ? "#1D4153" : "#f0f4f8",
              color: filterStatus === filterValue ? "#fff" : "#1D4153",
            }}
          >
            {filterValue.charAt(0).toUpperCase() + filterValue.slice(1)}
          </button>
        ))}
      </div>

      <div className="table-container">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f4f8fb" }}>
              {["Booking Ref", "Client", "Amount (BDT)", "Transaction ID", "Gateway", "Date", "Status", "Actions"].map((heading) => (
                <th key={heading} style={{ padding: "12px 14px", textAlign: "left", fontSize: 13, fontWeight: 700, color: "#1D4153", borderBottom: "1px solid #e2eaf1" }}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((payment) => (
              <tr key={payment.id} style={{ borderBottom: "1px solid #f0f4f7" }}>
                <td style={{ padding: "13px 14px", fontWeight: 700, fontSize: 14, color: "#1D4153" }}>{payment.booking_reference || payment.booking}</td>
                <td style={{ padding: "13px 14px", fontSize: 14 }}>{payment.client_name || "—"}</td>
                <td style={{ padding: "13px 14px", fontSize: 14, fontWeight: 600 }}>৳ {Number(payment.amount || 0).toLocaleString()}</td>
                <td style={{ padding: "13px 14px", fontSize: 13, color: "#5a7284" }}>{maskTransactionId(payment.transaction_id)}</td>
                <td style={{ padding: "13px 14px", fontSize: 13 }}>{payment.payment_gateway}</td>
                <td style={{ padding: "13px 14px", fontSize: 13, color: "#5a7284" }}>{new Date(payment.payment_date).toLocaleDateString()}</td>
                <td style={{ padding: "13px 14px" }}>
                  <span style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                    color: statusColor[payment.payment_status] || "#333",
                    background: statusBg[payment.payment_status] || "#eee",
                  }}>
                    {payment.payment_status.charAt(0).toUpperCase() + payment.payment_status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: "13px 14px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {payment.payment_status !== "success" && (
                      <button
                        onClick={() => handleVerify(payment.id, "success")}
                        disabled={activeActionId === payment.id}
                        style={{ padding: "6px 12px", borderRadius: 7, border: "none", background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                      >
                        {activeActionId === payment.id ? "Working..." : "Verify"}
                      </button>
                    )}
                    {payment.payment_status !== "failed" && (
                      <button
                        onClick={() => handleVerify(payment.id, "failed")}
                        disabled={activeActionId === payment.id}
                        style={{ padding: "6px 12px", borderRadius: 7, border: "none", background: "#dc2626", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                      >
                        {activeActionId === payment.id ? "Working..." : "Reject"}
                      </button>
                    )}
                    <button
                      onClick={() => setSelected(payment)}
                      style={{ padding: "6px 12px", borderRadius: 7, border: "1px solid #c5d5e0", background: "#fff", color: "#1D4153", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(8,24,34,0.44)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{ background: "#fff", borderRadius: 16, padding: 28, minWidth: 360, maxWidth: 440, boxShadow: "0 18px 40px rgba(9,28,40,0.28)" }}
            onClick={(event) => event.stopPropagation()}
          >
            <h3 style={{ color: "#1D4153", marginBottom: 18, fontSize: 20, fontWeight: 800 }}>Payment Details</h3>
            {[["Booking", selected.booking_reference || selected.booking], ["Client", selected.client_name || "—"], ["Amount", `৳ ${Number(selected.amount || 0).toLocaleString()}`], ["Transaction ID", selected.transaction_id], ["Gateway", selected.payment_gateway], ["Date", new Date(selected.payment_date).toLocaleString()], ["Status", selected.payment_status]].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f4f7", fontSize: 14 }}>
                <span style={{ fontWeight: 700, color: "#1D4153" }}>{label}</span>
                <span style={{ color: "#374151" }}>{value}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button
                onClick={() => setSelected(null)}
                style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #c5d5e0", background: "#f4f8fb", color: "#1D4153", fontWeight: 700, cursor: "pointer" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentAdmin;
