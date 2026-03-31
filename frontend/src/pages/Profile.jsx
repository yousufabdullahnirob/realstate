import React, { useState, useEffect } from "react";
import apiProxy from "../utils/proxyClient";
import Header from "../components/Header";
import "../styles.css";

const Profile = () => {
    const [user, setUser] = useState({
        full_name: "",
        email: "",
        phone: "",
        profile_image: "",
    });
    const [passwords, setPasswords] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await apiProxy.get("/profile/update/");
                setUser(data);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUserChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        try {
            const data = await apiProxy.post("/profile/update/", user);
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (error) {
            setMessage({ type: "error", text: error.message || "Failed to update profile" });
        }
    };

    const updatePassword = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        if (passwords.new_password !== passwords.confirm_password) {
            setMessage({ type: "error", text: "New passwords do not match" });
            return;
        }
        try {
            await apiProxy.post("/profile/change-password/", {
                old_password: passwords.old_password,
                new_password: passwords.new_password,
            });
            setMessage({ type: "success", text: "Password updated successfully!" });
            setPasswords({ old_password: "", new_password: "", confirm_password: "" });
        } catch (error) {
            setMessage({ type: "error", text: error.message || "Failed to update password" });
        }
    };

    if (loading) return <div className="container">Loading profile...</div>;

    return (
        <div className="admin-container">
            <Header />
            <div className="container" style={{ paddingTop: '120px', maxWidth: '800px' }}>
                <div className="dashboard-header">
                    <h1>My Profile</h1>
                    <p>Manage your account settings and security.</p>
                </div>

                {message.text && (
                    <div className={`alert ${message.type}`} style={{ 
                        padding: '15px', 
                        borderRadius: '8px', 
                        marginBottom: '20px',
                        backgroundColor: message.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                        color: message.type === 'success' ? '#4caf50' : '#f44336',
                        border: `1px solid ${message.type === 'success' ? '#4caf50' : '#f44336'}`
                    }}>
                        {message.text}
                    </div>
                )}

                <div className="stats-grid" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="card glass" style={{ padding: '30px', borderRadius: '20px' }}>
                        <h3 style={{ marginBottom: '20px' }}>Personal Information</h3>
                        <form onSubmit={updateProfile}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input 
                                        type="text" 
                                        name="full_name" 
                                        value={user.full_name} 
                                        onChange={handleUserChange}
                                        className="glass" 
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input 
                                        type="text" 
                                        name="phone" 
                                        value={user.phone || ""} 
                                        onChange={handleUserChange}
                                        className="glass"
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                                    />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label>Email (Read-only)</label>
                                <input 
                                    type="email" 
                                    value={user.email} 
                                    disabled 
                                    className="glass" 
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'not-allowed' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label>Profile Image URL</label>
                                <input 
                                    type="text" 
                                    name="profile_image" 
                                    value={user.profile_image || ""} 
                                    onChange={handleUserChange}
                                    className="glass"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <button type="submit" className="contact-btn">Update Profile</button>
                        </form>
                    </div>

                    <div className="card glass" style={{ padding: '30px', borderRadius: '20px', marginTop: '30px' }}>
                        <h3 style={{ marginBottom: '20px' }}>Security (Change Password)</h3>
                        <form onSubmit={updatePassword}>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label>Old Password</label>
                                <input 
                                    type="password" 
                                    name="old_password" 
                                    value={passwords.old_password} 
                                    onChange={handlePasswordChange}
                                    className="glass"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input 
                                        type="password" 
                                        name="new_password" 
                                        value={passwords.new_password} 
                                        onChange={handlePasswordChange}
                                        className="glass"
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        name="confirm_password" 
                                        value={passwords.confirm_password} 
                                        onChange={handlePasswordChange}
                                        className="glass"
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="contact-btn">Change Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
