import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Lock, Mail, Phone, Check, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiProxy from "../utils/proxyClient";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ full_name: "", email: "", phone: "", profile_image: "" });
    const [passwords, setPasswords] = useState({ old_password: "", new_password: "", confirm_password: "" });
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ type: "", msg: "" });
    const [activeTab, setActiveTab] = useState("personal");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await apiProxy.get("/profile/update/");
                setUser({ 
                    full_name: data.full_name, 
                    email: data.email, 
                    phone: data.phone || "",
                    profile_image: data.profile_image || ""
                });
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
            setTimeout(() => setStatus({ type: "", msg: "" }), 3000);
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
            setTimeout(() => setStatus({ type: "", msg: "" }), 3000);
        } catch (err) {
            setStatus({ type: "error", msg: err.message });
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', background: 'var(--bg-dark)' }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: 40, height: 40, border: '4px solid var(--gold-muted)', borderTop: '4px solid var(--gold)', borderRadius: '50%' }}
            />
        </div>
    );

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'var(--bg-dark)', 
            padding: '80px 40px',
            fontFamily: 'Plus Jakarta Sans, sans-serif'
        }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '16px',
                        marginBottom: '40px' 
                    }}
                >
                    <motion.button
                        onClick={() => navigate(-1)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50px',
                            background: 'rgba(255,255,255,0.88)',
                            border: '1px solid rgba(15,23,42,0.08)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
                            opacity: 0.9
                        }}
                    >
                        <ArrowLeft size={20} color="var(--text-primary)" />
                    </motion.button>
                    
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <h1 style={{ 
                            fontSize: '32px', 
                            fontWeight: 800, 
                            color: 'var(--text-primary)', 
                            marginBottom: '8px',
                            letterSpacing: '-0.5px'
                        }}>
                            Account Settings
                        </h1>
                        <p style={{ 
                            fontSize: '16px', 
                            color: 'var(--text-muted)', 
                            margin: 0 
                        }}>
                            Manage your personal information and security settings
                        </p>
                    </div>
                </motion.div>

                {/* Status Message */}
                {status.msg && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{ 
                            padding: "16px 20px", 
                            borderRadius: "50px", 
                            marginBottom: "24px",
                            background: status.type === "success" 
                                ? "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)" 
                                : "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)",
                            color: status.type === "success" ? "#10b981" : "#ef4444",
                            fontSize: 14, 
                            fontWeight: 600,
                            border: `1px solid ${status.type === "success" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                    >
                        {status.type === "success" ? <Check size={18} /> : <X size={18} />}
                        {status.msg}
                    </motion.div>
                )}

                {/* Profile Image Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    style={{ 
                        background: 'rgba(255,255,255,0.88)', 
                        borderRadius: '50px', 
                        padding: '40px', 
                        marginBottom: '24px',
                        boxShadow: '0 25px 60px rgba(15,23,42,0.14)', 
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(15,23,42,0.08)',
                        opacity: 0.9,
                        textAlign: 'center'
                    }}
                >
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
                        <div style={{ 
                            width: '120px', 
                            height: '120px', 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-muted) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            boxShadow: '0 20px 40px rgba(245, 158, 11, 0.3)'
                        }}>
                            <User size={48} color="white" />
                        </div>
                    </div>
                    <h3 style={{ 
                        fontSize: '24px', 
                        fontWeight: 700, 
                        color: 'var(--text-primary)', 
                        marginBottom: '4px' 
                    }}>
                        {user.full_name || 'User'}
                    </h3>
                    <p style={{ 
                        fontSize: '14px', 
                        color: 'var(--text-muted)', 
                        margin: 0 
                    }}>
                        {user.email}
                    </p>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ 
                        display: 'flex', 
                        background: 'rgba(255,255,255,0.88)', 
                        borderRadius: '50px', 
                        padding: '6px',
                        marginBottom: '24px',
                        boxShadow: '0 10px 30px rgba(15,23,42,0.08)',
                        border: '1px solid rgba(15,23,42,0.08)',
                        opacity: 0.9
                    }}
                >
                    {[
                        { id: 'personal', label: 'Personal Info', icon: User },
                        { id: 'security', label: 'Security', icon: Lock }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                flex: 1,
                                padding: '12px 20px',
                                borderRadius: '50px',
                                border: 'none',
                                background: activeTab === tab.id ? 'var(--gold)' : 'transparent',
                                color: activeTab === tab.id ? 'white' : 'var(--text-primary)',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </motion.div>

                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                    <motion.form 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        onSubmit={handleUpdateProfile}
                        style={{ 
                            background: 'rgba(255,255,255,0.88)', 
                            borderRadius: '50px', 
                            padding: '40px', 
                            boxShadow: '0 25px 60px rgba(15,23,42,0.14)', 
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(15,23,42,0.08)',
                            opacity: 0.9
                        }}
                    >
                        <h3 style={{ 
                            fontSize: '20px', 
                            fontWeight: 700, 
                            color: 'var(--text-primary)', 
                            marginBottom: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <User size={20} color="var(--gold)" />
                            Personal Information
                        </h3>
                        
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div>
                                <label style={{ 
                                    display: 'block', 
                                    fontSize: '12px', 
                                    fontWeight: 700, 
                                    color: 'var(--text-muted)', 
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Full Name
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <User size={16} style={{ 
                                        position: 'absolute', 
                                        left: '16px', 
                                        top: '50%', 
                                        transform: 'translateY(-50%)',
                                        color: 'var(--text-muted)'
                                    }} />
                                    <input 
                                        type="text" 
                                        value={user.full_name} 
                                        onChange={e => setUser({...user, full_name: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px 14px 44px',
                                            border: '2px solid #e0e0e0',
                                            borderRadius: '50px',
                                            fontSize: '14px',
                                            background: '#fff',
                                            color: 'var(--text-primary)',
                                            outline: 'none',
                                            transition: 'border-color 0.3s',
                                            opacity: 0.8
                                        }}
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; e.target.style.opacity = '1'; }}
                                        onBlur={(e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.opacity = '0.8'; }}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label style={{ 
                                    display: 'block', 
                                    fontSize: '12px', 
                                    fontWeight: 700, 
                                    color: 'var(--text-muted)', 
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Email Address
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} style={{ 
                                        position: 'absolute', 
                                        left: '16px', 
                                        top: '50%', 
                                        transform: 'translateY(-50%)',
                                        color: 'var(--text-muted)'
                                    }} />
                                    <input 
                                        type="email" 
                                        value={user.email} 
                                        onChange={e => setUser({...user, email: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px 14px 44px',
                                            border: '2px solid #e0e0e0',
                                            borderRadius: '50px',
                                            fontSize: '14px',
                                            background: '#fff',
                                            color: 'var(--text-primary)',
                                            outline: 'none',
                                            transition: 'border-color 0.3s',
                                            opacity: 0.8
                                        }}
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; e.target.style.opacity = '1'; }}
                                        onBlur={(e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.opacity = '0.8'; }}
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label style={{ 
                                    display: 'block', 
                                    fontSize: '12px', 
                                    fontWeight: 700, 
                                    color: 'var(--text-muted)', 
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Phone Number
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={16} style={{ 
                                        position: 'absolute', 
                                        left: '16px', 
                                        top: '50%', 
                                        transform: 'translateY(-50%)',
                                        color: 'var(--text-muted)'
                                    }} />
                                    <input 
                                        type="text" 
                                        value={user.phone} 
                                        onChange={e => setUser({...user, phone: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px 14px 44px',
                                            border: '2px solid #e0e0e0',
                                            borderRadius: '50px',
                                            fontSize: '14px',
                                            background: '#fff',
                                            color: 'var(--text-primary)',
                                            outline: 'none',
                                            transition: 'border-color 0.3s',
                                            opacity: 0.8
                                        }}
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; e.target.style.opacity = '1'; }}
                                        onBlur={(e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.opacity = '0.8'; }}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <motion.button 
                            type="submit" 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{ 
                                marginTop: '32px',
                                width: '100%',
                                padding: '16px 24px',
                                background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-muted) 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50px',
                                fontSize: '16px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)',
                                transition: 'all 0.3s ease',
                                opacity: 0.9
                            }}
                        >
                            Update Profile
                        </motion.button>
                    </motion.form>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <motion.form 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        onSubmit={handleChangePassword}
                        style={{ 
                            background: 'rgba(255,255,255,0.88)', 
                            borderRadius: '50px', 
                            padding: '40px', 
                            boxShadow: '0 25px 60px rgba(15,23,42,0.14)', 
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(15,23,42,0.08)',
                            opacity: 0.9
                        }}
                    >
                        <h3 style={{ 
                            fontSize: '20px', 
                            fontWeight: 700, 
                            color: 'var(--text-primary)', 
                            marginBottom: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <Lock size={20} color="var(--gold)" />
                            Change Password
                        </h3>
                        
                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div>
                                <label style={{ 
                                    display: 'block', 
                                    fontSize: '12px', 
                                    fontWeight: 700, 
                                    color: 'var(--text-muted)', 
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Current Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={16} style={{ 
                                        position: 'absolute', 
                                        left: '16px', 
                                        top: '50%', 
                                        transform: 'translateY(-50%)',
                                        color: 'var(--text-muted)'
                                    }} />
                                    <input 
                                        type="password" 
                                        value={passwords.old_password}
                                        onChange={e => setPasswords({...passwords, old_password: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px 14px 44px',
                                            border: '2px solid #e0e0e0',
                                            borderRadius: '50px',
                                            fontSize: '14px',
                                            background: '#fff',
                                            color: 'var(--text-primary)',
                                            outline: 'none',
                                            transition: 'border-color 0.3s',
                                            opacity: 0.8
                                        }}
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; e.target.style.opacity = '1'; }}
                                        onBlur={(e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.opacity = '0.8'; }}
                                        placeholder="Enter current password"
                                    />
                                </div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ 
                                        display: 'block', 
                                        fontSize: '12px', 
                                        fontWeight: 700, 
                                        color: 'var(--text-muted)', 
                                        marginBottom: '8px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        New Password
                                    </label>
                                    <input 
                                        type="password" 
                                        value={passwords.new_password}
                                        onChange={e => setPasswords({...passwords, new_password: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            border: '2px solid #e0e0e0',
                                            borderRadius: '50px',
                                            fontSize: '14px',
                                            background: '#fff',
                                            color: 'var(--text-primary)',
                                            outline: 'none',
                                            transition: 'border-color 0.3s',
                                            opacity: 0.8
                                        }}
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; e.target.style.opacity = '1'; }}
                                        onBlur={(e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.opacity = '0.8'; }}
                                        placeholder="New password"
                                    />
                                </div>
                                
                                <div>
                                    <label style={{ 
                                        display: 'block', 
                                        fontSize: '12px', 
                                        fontWeight: 700, 
                                        color: 'var(--text-muted)', 
                                        marginBottom: '8px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Confirm Password
                                    </label>
                                    <input 
                                        type="password" 
                                        value={passwords.confirm_password}
                                        onChange={e => setPasswords({...passwords, confirm_password: e.target.value})}
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            border: '2px solid #e0e0e0',
                                            borderRadius: '50px',
                                            fontSize: '14px',
                                            background: '#fff',
                                            color: 'var(--text-primary)',
                                            outline: 'none',
                                            transition: 'border-color 0.3s',
                                            opacity: 0.8
                                        }}
                                        onFocus={(e) => { e.target.style.borderColor = 'var(--gold)'; e.target.style.opacity = '1'; }}
                                        onBlur={(e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.opacity = '0.8'; }}
                                        placeholder="Confirm password"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <motion.button 
                            type="submit" 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{ 
                                marginTop: '32px',
                                width: '100%',
                                padding: '16px 24px',
                                background: 'linear-gradient(135deg, var(--accent) 0%, rgba(239, 68, 68, 0.8) 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50px',
                                fontSize: '16px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)',
                                transition: 'all 0.3s ease',
                                opacity: 0.9
                            }}
                        >
                            Change Password
                        </motion.button>
                    </motion.form>
                )}
            </div>
        </div>
    );
};

export default Profile;
