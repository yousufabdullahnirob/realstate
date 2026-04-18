import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import apiProxy from '../utils/proxyClient';

import loginBg from '../assets/login-bg.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isExpired = new URLSearchParams(location.search).get('expired');

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const cleanEmail = email.trim();
    try {
      const data = await apiProxy.post('/login/', { email: cleanEmail, password });
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (data.user.role === 'admin' || data.user.role === 'agent') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      if (error.status === 404 || error.message?.includes("not found")) {
        navigate('/register', { state: { message: "Please register first." } });
      } else {
        alert(error.message || 'Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="login-wrapper" style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      color: 'var(--text-color)',
      overflow: 'hidden'
    }}>
      {isExpired && (
        <div style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
          background: '#fee2e2', color: '#991b1b', padding: '12px 24px', borderRadius: '12px',
          border: '1px solid #fecaca', fontWeight: '700', zIndex: 100, fontSize: '14px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          ⚠️ Session expired. Please log in again.
        </div>
      )}
      <div style={{
        position: 'absolute',
        inset: -20,
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(8px)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 0
      }} />

      {/* Decorative Glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />

      <div className="login-card glass-premium" style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '450px',
        width: '90%',
        padding: '60px 50px',
        borderRadius: '32px',
        boxShadow: '0 40px 100px -20px rgba(14, 165, 233, 0.15)',
        animation: 'fadeInUp 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)'
      }}>
        <style>
          {`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(40px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .login-input::placeholder { color: var(--text-muted); }
            .login-input:focus { border-color: var(--primary) !important; background: var(--white) !important; box-shadow: 0 0 20px rgba(14, 165, 233, 0.15); }
            .login-btn:hover { background: var(--secondary) !important; transform: translateY(-3px) scale(1.02); box-shadow: 0 20px 40px rgba(14, 165, 233, 0.2) !important; }
            .auth-link-text:hover { color: var(--secondary) !important; }
          `}
        </style>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-1px', color: 'var(--heading-color)' }}>Welcome back</h2>

        </div>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Email Address</label>
            <input 
              className="login-input"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="" 
              required
              autoComplete="off"


              style={{ 
                width: '100%', 
                padding: '16px 20px', 
                borderRadius: '16px', 
                background: 'rgba(255, 255, 255, 0.8)', 
                border: '1px solid rgba(14, 165, 233, 0.2)',
                color: 'var(--text-dark)',
                outline: 'none',
                transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
                boxSizing: 'border-box',
                fontSize: '15px'
              }}
            />
          </div>

          <div style={{ marginBottom: '40px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                className="login-input"
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="" 
                required
                style={{ 
                  width: '100%', 
                  padding: '16px 20px', 
                  paddingRight: '50px',
                  borderRadius: '16px', 
                  background: 'rgba(255, 255, 255, 0.8)', 
                  border: '1px solid rgba(14, 165, 233, 0.2)',
                  color: 'var(--text-dark)',
                  outline: 'none',
                  transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
                  boxSizing: 'border-box',
                  fontSize: '15px'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  zIndex: 2
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>


          <button 
            type="submit" 
            className="login-btn"
            style={{ 
              width: '100%', 
              padding: '18px', 
              borderRadius: '16px', 
              border: 'none',
              background: 'var(--primary)',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
              boxShadow: '0 10px 30px rgba(14, 165, 233, 0.2)'
            }}
          >
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
          <Link to="/register" className="auth-link-text" style={{ 
            color: 'var(--primary)', 
            textDecoration: 'none', 
            fontWeight: '700',
            transition: 'all 0.3s ease'
          }}>Register Now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
