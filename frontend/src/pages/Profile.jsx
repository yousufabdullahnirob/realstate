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
            <div className="container" style={{ paddingTop: '150px', maxWidth: '900px' }}>
                <div className="dashboard-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h1 style={{ fontSize: '42px', fontWeight: '800' }}>Account Settings</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Manage your digital presence and security preferences.</p>
                </div>

                {message.text && (
                    <div className={`alert ${message.type}`} style={{ 
                        padding: '18px 25px', 
                        borderRadius: '16px', 
                        marginBottom: '30px',
                        backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
                        border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
                        fontWeight: '600',
                        fontSize: '14px',
                        animation: 'fadeIn 0.3s ease'
                    }}>
                        {message.type === 'success' ? '✓ ' : '⚠ '} {message.text}
                    </div>
                )}

                <div className="stats-grid" style={{ gridTemplateColumns: '1fr', gap: '40px' }}>
                    <div className="card glass-premium" style={{ padding: '45px', borderRadius: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: 'white', overflow: 'hidden' }}>
                                {user.profile_image ? <img src={user.profile_image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : user.full_name.charAt(0)}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '24px', fontWeight: '800' }}>Personal Profile</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Updated regularly for security.</p>
                            </div>
                        </div>
                        
                        <form onSubmit={updateProfile}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', color: 'var(--text-muted)' }}>Full Name</label>
                                    <input 
                                        type="text" 
                                        name="full_name" 
                                        value={user.full_name} 
                                        onChange={handleUserChange}
                                        className="form-input" 
                                        style={{ marginBottom: 0 }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', color: 'var(--text-muted)' }}>Phone Identity</label>
                                    <input 
                                        type="text" 
                                        name="phone" 
                                        value={user.phone || ""} 
                                        onChange={handleUserChange}
                                        className="form-input"
                                        style={{ marginBottom: 0 }}
                                        placeholder="+880 1XXX-XXXXXX"
                                    />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', color: 'var(--text-muted)' }}>Email Access (Verified)</label>
                                <input 
                                    type="email" 
                                    value={user.email} 
                                    disabled 
                                    className="form-input" 
                                    style={{ marginBottom: 0, opacity: 0.6, cursor: 'not-allowed', background: 'rgba(0,0,0,0.05)' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '40px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', color: 'var(--text-muted)' }}>Profile Image (Direct URL)</label>
                                <input 
                                    type="text" 
                                    name="profile_image" 
                                    value={user.profile_image || ""} 
                                    onChange={handleUserChange}
                                    className="form-input"
                                    style={{ marginBottom: 0 }}
                                    placeholder="https://images.unsplash.com/your-photo"
                                />
                            </div>
                            <button type="submit" className="contact-btn" style={{ width: '100%', padding: '18px' }}>Sync Profile Changes</button>
                        </form>
                    </div>

                    <div className="card glass-premium" style={{ padding: '45px', borderRadius: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: 'var(--danger)' }}>
                                🔒
                            </div>
                            <div>
                                <h3 style={{ fontSize: '24px', fontWeight: '800' }}>Security Vault</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Secure your account with a strong password.</p>
                            </div>
                        </div>

                        <form onSubmit={updatePassword}>
                            <div className="form-group" style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', color: 'var(--text-muted)' }}>Current Security Key</label>
                                <input 
                                    type="password" 
                                    name="old_password" 
                                    value={passwords.old_password} 
                                    onChange={handlePasswordChange}
                                    className="form-input"
                                    style={{ marginBottom: 0 }}
                                    placeholder="••••••••"
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', color: 'var(--text-muted)' }}>New Key</label>
                                    <input 
                                        type="password" 
                                        name="new_password" 
                                        value={passwords.new_password} 
                                        onChange={handlePasswordChange}
                                        className="form-input"
                                        style={{ marginBottom: 0 }}
                                        placeholder="Min. 8 characters"
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', color: 'var(--text-muted)' }}>Repeat New Key</label>
                                    <input 
                                        type="password" 
                                        name="confirm_password" 
                                        value={passwords.confirm_password} 
                                        onChange={handlePasswordChange}
                                        className="form-input"
                                        style={{ marginBottom: 0 }}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="contact-btn" style={{ width: '100%', padding: '18px', background: 'var(--text-dark)' }}>Update Security Keys</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
