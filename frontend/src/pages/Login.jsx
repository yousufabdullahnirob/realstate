import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiProxy from '../utils/proxyClient';
import Logo from '../Logo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await apiProxy.post('/login/', { email, password });
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (data.user.role === 'admin' || data.user.role === 'agent') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert(error.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-wrapper" style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #020617 100%)',
      position: 'relative',
      fontFamily: '"Outfit", sans-serif',
      color: '#f8fafc'
    }}>
      {/* Decorative Glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />

      <div className="login-card" style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '450px',
        width: '90%',
        padding: '60px 50px',
        borderRadius: '32px',
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.8)',
        animation: 'fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <style>
          {`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(40px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .login-input::placeholder { color: rgba(148, 163, 184, 0.4); }
            .login-input:focus { border-color: #3b82f6 !important; background: rgba(255, 255, 255, 0.05) !important; box-shadow: 0 0 20px rgba(59, 130, 246, 0.2); }
            .login-btn:hover { background: #60a5fa !important; transform: translateY(-3px) scale(1.02); box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3) !important; }
          `}
        </style>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ marginBottom: '24px', display: 'inline-block' }}>
            <Logo className="login-logo" style={{ height: '50px' }} />
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-1px', color: '#fff' }}>Welcome back</h2>
          <p style={{ color: '#94a3b8', marginTop: '12px', fontSize: '15px' }}>Access your administrative dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
            <input 
              className="login-input"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com" 
              required
              style={{ 
                width: '100%', 
                padding: '16px 20px', 
                borderRadius: '16px', 
                background: 'rgba(255, 255, 255, 0.03)', 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#fff',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                fontSize: '15px'
              }}
            />
          </div>

          <div style={{ marginBottom: '40px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Password</label>
            <input 
              className="login-input"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
              style={{ 
                width: '100%', 
                padding: '16px 20px', 
                borderRadius: '16px', 
                background: 'rgba(255, 255, 255, 0.03)', 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#fff',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                fontSize: '15px'
              }}
            />
          </div>

          <button 
            type="submit" 
            className="login-btn"
            style={{ 
              width: '100%', 
              padding: '18px', 
              borderRadius: '16px', 
              border: 'none',
              background: '#3b82f6',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 10px 30px rgba(59, 130, 246, 0.2)'
            }}
          >
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: '#64748b' }}>Don't have an account? </span>
          <Link to="/register" style={{ 
            color: '#60a5fa', 
            textDecoration: 'none', 
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}>Register Now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
