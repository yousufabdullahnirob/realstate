import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from './assets/mahim_logo.png'; // Updated to restored logo

const Login = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('client');
    const [email, setEmail] = useState(localStorage.getItem('savedEmail') || '');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('savedEmail'));
    const [error, setError] = useState('');

    const handleRole = (r) => {
        setRole(r);
    };

    const handleLogin = async () => {
        setError('');
        if (!email) return setError("Please enter your email address.");
        if (!password) return setError("Please enter your password.");
        if (!email.includes("@")) return setError("Please enter a valid email address.");

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: email, password: password }),
            });

            const data = await response.json();

            if (response.ok) {
                // alert(`Login Success ✅ (${role.toUpperCase()})`); // Removed alert for smoother UX
                navigate('/dashboard');
                if (rememberMe) {
                    localStorage.setItem('savedEmail', email);
                } else {
                    localStorage.removeItem('savedEmail');
                }
            } else {
                setError(data.error || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Failed to connect to server.");
        }
    };

    return (
        <>
            <div className="bg"></div>
            <div className="veil"></div>
            <main className="wrap">
                <section className="card" aria-label="Login">
                    <div className="top">
                        <div className="logo">
                            {/* Ideally replace with actual imported SVG or image URL */}
                            <img src={logo} alt="Mahim Builders Logo" />
                        </div>
                        <div className="brand">
                            <h1>Mahim Builders &amp; Construction Ltd.</h1>
                            <p>Apartment Selling Web Application</p>
                        </div>
                    </div>

                    <div className="content">
                        <div className="title">Login</div>

                        <span className="label">Login As</span>
                        <div className="seg" role="tablist" aria-label="Role switcher">
                            <button 
                                className={role === 'client' ? 'active' : ''} 
                                onClick={() => handleRole('client')}
                                type="button"
                            >
                                <span className="dot"></span> Client / Customer
                            </button>
                            <button 
                                className={role === 'admin' ? 'active' : ''} 
                                onClick={() => handleRole('admin')}
                                type="button"
                            >
                                <span className="dot"></span> Admin
                            </button>
                        </div>

                        <label className="label" htmlFor="email">Email Address</label>
                        <input
                            className="input"
                            id="email"
                            type="email"
                            placeholder="example@email.com"
                            autoComplete="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label className="label" htmlFor="pass">Password</label>
                        <div className="pwdWrap">
                            <input
                                className="input"
                                id="pass"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button 
                                className="eye" 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "HIDE" : "SHOW"}
                            </button>
                        </div>

                        <div className="row">
                            <label className="remember">
                                <input 
                                    type="checkbox" 
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)} 
                                />
                                Remember me
                            </label>
                            <span className="link" onClick={() => alert("Forgot Password not implemented")}>Forgot Password?</span>
                        </div>

                        {error && <div className="error">{error}</div>}

                        <button className="btn" onClick={handleLogin}>Log In</button>

                        <div className="row">
                            <span style={{ color: 'rgba(234, 240, 255, 0.7)', fontSize: '13px' }}>New here?</span>
                            <span className="link" onClick={() => alert("Signup not implemented")}>Create an account</span>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Login;
