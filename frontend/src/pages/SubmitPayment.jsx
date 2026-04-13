import React, { useState, useEffect } from "react";
import apiProxy from "../utils/proxyClient";
import { useNavigate } from "react-router-dom";

const SubmitPayment = () => {
    const [bookings, setBookings] = useState([]);
    const [formData, setFormData] = useState({
        booking: "",
        amount: "",
        transaction_id: "",
        proof: null
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const data = await apiProxy.get("/bookings/my/");
                setBookings(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, booking: data[0].id }));
                }
            } catch (err) {
                console.error("Failed to fetch bookings:", err);
            }
        };
        fetchBookings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
                // Validate fields
                if (!formData.booking || !formData.amount || !formData.transaction_id || !formData.proof) {
                    alert("All fields are required.");
                    setLoading(false);
                    return;
                }
                const data = new FormData();
                data.append("booking", formData.booking);
                data.append("transaction_id", formData.transaction_id);
                data.append("amount", formData.amount);
                data.append("payment_proof", formData.proof); // Model field is payment_proof
                
                // Using raw fetch for FormData as apiProxy.post stringifies the body
                const token = localStorage.getItem('access');
                const response = await fetch('/api/payments/submit/', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: data
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(JSON.stringify(error));
                }

                alert("Payment proof submitted successfully! Pending verification.");
                navigate("/dashboard");
        } catch (error) {
            console.error("Submission failed:", error);
            alert(`Failed to submit: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '140px', maxWidth: '600px' }}>
            <div className="form-card glass-premium">
                <h2 style={{ color: 'var(--primary)' }}>Submit Payment Proof</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Upload your transaction details for verification.</p>
                
                {bookings.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px' }}>
                         <p style={{ color: '#991b1b', fontWeight: '700' }}>⚠️ No Active Bookings Found</p>
                         <p style={{ fontSize: '13px', color: '#7f1d1d', marginTop: '8px' }}>You need an active booking before you can submit a payment proof.</p>
                         <button onClick={() => navigate('/apartments')} style={{ marginTop: '16px', background: 'var(--primary)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Browse Apartments</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Amount (BDT)</label>
                            <input 
                                type="number" 
                                required 
                                value={formData.amount}
                                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Transaction ID (TrxID)</label>
                            <input 
                                type="text" 
                                required 
                                value={formData.transaction_id}
                                placeholder="e.g. 7K2B8P9Q"
                                onChange={(e) => setFormData({...formData, transaction_id: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Payment Proof (Screenshot or PDF)</label>
                            <input 
                                type="file" 
                                accept="image/*,application/pdf"
                                onChange={(e) => setFormData({...formData, proof: e.target.files[0]})}
                            />
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Allowed: JPG, PNG, PDF (Max 5MB)</p>
                        </div>
                        <button type="submit" className="contact-btn" disabled={loading} style={{ width: '100%' }}>
                            {loading ? "Submitting..." : "Submit for Verification"}
                        </button>
                        <button type="button" onClick={() => navigate('/dashboard')} style={{ width: '100%', marginTop: '10px', background: 'transparent', border: '1px solid #ddd', color: 'var(--text-dark)', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>
                            Cancel
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SubmitPayment;
