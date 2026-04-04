import React, { useEffect, useState } from "react";
import apiProxy from "../utils/proxyClient";

const PaymentManagement = () => {
    const [payments, setPayments] = useState([]);
    const [pendingPayments, setPendingPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const allPayments = await apiProxy.get("/payments/all/");
                setPayments(allPayments);
                const pending = await apiProxy.get("/payments/pending/");
                setPendingPayments(pending);
            } catch (error) {
                console.error("Failed to fetch payments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    const handleVerify = async (id, status) => {
        try {
            await apiProxy.post(`/payments/${id}/verify/`, { status });
            setPayments(payments.map(p => p.id === id ? { ...p, verification_status: status } : p));
        } catch (error) {
            alert("Failed to update payment status.");
        }
    };

    if (loading) return <div>Loading Payments...</div>;

    return (
        <div className="page-content">
            <h2>Payment Verification</h2>
            <div className="table-container">
                <h3>Pending Payments</h3>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Amount</th>
                            <th>TrxID</th>
                            <th>Date</th>
                            <th>Proof</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingPayments.map(pay => (
                            <tr key={pay.id}>
                                <td>{pay.id}</td>
                                <td>{pay.amount.toLocaleString()} BDT</td>
                                <td>{pay.transaction_id}</td>
                                <td>{pay.payment_date}</td>
                                <td>
                                    {pay.payment_proof_image ? (
                                        <a href={pay.payment_proof_image} target="_blank" rel="noreferrer">View Image</a>
                                    ) : "No Proof"}
                                </td>
                                <td><span className={`status-${pay.verification_status}`}>{pay.verification_status}</span></td>
                                <td>
                                    {pay.verification_status === 'pending' && (
                                        <>
                                            <button className="approve-btn" onClick={() => handleVerify(pay.id, 'verified')}>Approve</button>
                                            <button className="delete-btn" onClick={() => handleVerify(pay.id, 'rejected')}>Reject</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="table-container" style={{ marginTop: '40px' }}>
                <h3>All Payments</h3>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Amount</th>
                            <th>TrxID</th>
                            <th>Date</th>
                            <th>Proof</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(pay => (
                            <tr key={pay.id}>
                                <td>{pay.id}</td>
                                <td>{pay.amount.toLocaleString()} BDT</td>
                                <td>{pay.transaction_id}</td>
                                <td>{pay.payment_date}</td>
                                <td>
                                    {pay.payment_proof_image ? (
                                        <a href={pay.payment_proof_image} target="_blank" rel="noreferrer">View Image</a>
                                    ) : "No Proof"}
                                </td>
                                <td><span className={`status-${pay.verification_status}`}>{pay.verification_status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentManagement;
