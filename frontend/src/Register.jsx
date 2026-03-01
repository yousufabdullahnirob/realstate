import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Reusing styles
import logo from './assets/mahim_logo.png';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        confirm_password: '',
        role: 'customer'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRole = (role) => {
        setFormData({ ...formData, role });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirm_password) {
            return setError("Passwords do not match.");
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Registration successful! Redirecting to login...");
                setTimeout(() => navigate('/dashboard'), 2000);
            } else {
                // Handle field-specific errors from Django
                const errorMsg = data.detail || (data.password ? data.password[0] : null) || (data.email ? data.email[0] : null) || "Registration failed";
                setError(errorMsg);
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError("Failed to connect to server.");
        }
    };

    return (
        <>
            <div className="bg"></div>
            <div className="veil"></div>
            <main className="wrap">
                <section className="card" aria-label="Register">
                    <div className="top">
                        <div className="logo">
                            <img src={logo} alt="Mahim Builders Logo" />
                        </div>
                        <div className="brand">
                            <h1>Mahim Builders &amp; Construction Ltd.</h1>
                            <p>Create an Account</p>
                        </div>
                    </div>

                    <form className="content" onSubmit={handleRegister}>
                        <div className="title">Sign Up</div>

                        <span className="label">I am a...</span>
                        <div className="seg" role="tablist" aria-label="Role switcher">
                            <button 
                                className={formData.role === 'customer' ? 'active' : ''} 
                                onClick={() => handleRole('customer')}
                                type="button"
                            >
                                <span className="dot"></span> Client / Customer
                            </button>
                            <button 
                                className={formData.role === 'admin' ? 'active' : ''} 
                                onClick={() => handleRole('admin')}
                                type="button"
                            >
                                <span className="dot"></span> Admin
                            </button>
                        </div>

                        <label className="label" htmlFor="full_name">Full Name</label>
                        <input
                            className="input"
                            id="full_name"
                            type="text"
                            placeholder="John Doe"
                            required
                            value={formData.full_name}
                            onChange={handleChange}
                        />

                        <label className="label" htmlFor="email">Email Address</label>
                        <input
                            className="input"
                            id="email"
                            type="email"
                            placeholder="example@email.com"
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <label className="label" htmlFor="phone">Phone Number</label>
                        <input
                            className="input"
                            id="phone"
                            type="text"
                            placeholder="+8801XXXXXXXXX"
                            value={formData.phone}
                            onChange={handleChange}
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div>
                                <label className="label" htmlFor="password">Password</label>
                                <input
                                    className="input"
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="label" htmlFor="confirm_password">Confirm</label>
                                <input
                                    className="input"
                                    id="confirm_password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {error && <div className="error" style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '10px' }}>{error}</div>}
                        {success && <div className="success" style={{ color: '#51cf66', fontSize: '12px', marginTop: '10px' }}>{success}</div>}

                        <button className="btn" type="submit" style={{ marginTop: '20px' }}>Create Account</button>

                        <div className="row" style={{ marginTop: '15px' }}>
                            <span style={{ color: 'rgba(234, 240, 255, 0.7)', fontSize: '13px' }}>Already have an account?</span>
                            <span className="link" onClick={() => navigate('/dashboard')}>Log In</span>
                        </div>
                    </form>
                </section>
            </main>
        </>
    );
};

export default Register;
