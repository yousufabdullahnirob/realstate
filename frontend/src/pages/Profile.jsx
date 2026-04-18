import React, { useState, useEffect } from "react";
import apiProxy from "../utils/proxyClient";

const Profile = () => {
    const [user, setUser] = useState({ full_name: "", email: "" });
    const [passwords, setPasswords] = useState({ old_password: "", new_password: "", confirm_password: "" });
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ type: "", msg: "" });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await apiProxy.get("/profile/update/");
                setUser({ full_name: data.full_name, email: data.email });
            } catch (err) {
                setStatus({ type: "error", msg: "Failed to load profile." });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await apiProxy.patch("/profile/update/", user);
            setStatus({ type: "success", msg: "Profile updated successfully!" });
            // Update localStorage
            const localUser = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...localUser, ...user }));
        } catch (err) {
            setStatus({ type: "error", msg: err.message });
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwords.new_password !== passwords.confirm_password) {
            return setStatus({ type: "error", msg: "New passwords do not match." });
        }
        try {
            await apiProxy.post("/profile/change-password/", {
                old_password: passwords.old_password,
                new_password: passwords.new_password
            });
            setStatus({ type: "success", msg: "Password changed successfully!" });
            setPasswords({ old_password: "", new_password: "", confirm_password: "" });
        } catch (err) {
            setStatus({ type: "error", msg: err.message });
        }
    };

    if (loading) return <div style={{ padding: 40, color: "var(--text-muted)" }}>Loading profile...</div>;

    return (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 32 }}>Account Settings</h1>

            {status.msg && (
                <div style={{ 
                    padding: "12px 16px", borderRadius: 8, marginBottom: 24,
                    background: status.type === "success" ? "#d1fae5" : "#fee2e2",
                    color: status.type === "success" ? "#065f46" : "#991b1b",
                    fontSize: 14, fontWeight: 600
                }}>
                    {status.msg}
                </div>
            )}

            <div className="preview-section glass" style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Personal Information</h3>
                <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>Full Name</label>
                        <input 
                            type="text" 
                            className="admin-input" 
                            value={user.full_name} 
                            onChange={e => setUser({...user, full_name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>Email Address</label>
                        <input 
                            type="email" 
                            className="admin-input" 
                            value={user.email} 
                            onChange={e => setUser({...user, email: e.target.value})}
                        />
                    </div>
                    <button type="submit" className="approve-btn" style={{ marginTop: 8, width: "fit-content" }}>Update Profile</button>
                </form>
            </div>

            <div className="preview-section glass">
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Change Password</h3>
                <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>Current Password</label>
                        <input 
                            type="password" 
                            className="admin-input" 
                            value={passwords.old_password}
                            onChange={e => setPasswords({...passwords, old_password: e.target.value})}
                        />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>New Password</label>
                            <input 
                                type="password" 
                                className="admin-input" 
                                value={passwords.new_password}
                                onChange={e => setPasswords({...passwords, new_password: e.target.value})}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>Confirm New Password</label>
                            <input 
                                type="password" 
                                className="admin-input" 
                                value={passwords.confirm_password}
                                onChange={e => setPasswords({...passwords, confirm_password: e.target.value})}
                            />
                        </div>
                    </div>
                    <button type="submit" className="delete-btn" style={{ marginTop: 8, width: "fit-content", background: "var(--accent)" }}>Change Password</button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
