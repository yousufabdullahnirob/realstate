import React, { useState } from "react";
import apiProxy from "../utils/proxyClient";
import { useNavigate } from "react-router-dom";

const SubmitPayment = () => {
    const [formData, setFormData] = useState({
        amount: "",
        transaction_id: "",
        proof: null
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
                // Validate fields
                if (!formData.amount || !formData.transaction_id || !formData.proof) {
                    alert("All fields are required.");
                    setLoading(false);
                    return;
                }
                const data = new FormData();
                data.append("transaction_id", formData.transaction_id);
                data.append("amount", formData.amount);
                data.append("proof", formData.proof);
                await apiProxy.post("/payments/submit/", data);
                alert("Payment proof submitted successfully! Pending verification.");
                navigate("/dashboard");
        } catch (error) {
            console.error("Submission failed:", error);
            alert("Failed to submit payment proof.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '140px', maxWidth: '600px' }}>
            <div className="form-card">
                <h2>Submit Payment Proof</h2>
                <p>Upload your transaction details for verification.</p>
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
                            onChange={(e) => setFormData({...formData, transaction_id: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Payment Proof Image</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setFormData({...formData, proof: e.target.files[0]})}
                        />
                    </div>
                    <button type="submit" className="contact-btn" disabled={loading}>
                        {loading ? "Submitting..." : "Submit Verification"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SubmitPayment;
