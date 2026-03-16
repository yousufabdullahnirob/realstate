import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    navigate('/admin');
  };

  return (
    <div className="login-wrapper" style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url("/images/login-bg.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      fontFamily: '"Inter", sans-serif'
    }}>
      {/* Overlay for better readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(3px)'
      }} />

      <div className="login-card" style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '450px',
        width: '90%',
        padding: '50px',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px) saturate(180%)',
        WebkitBackdropFilter: 'blur(15px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
        color: '#fff',
        animation: 'fadeInUp 0.8s ease-out'
      }}>
        <style>
          {`
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .login-input::placeholder { color: rgba(255, 255, 255, 0.6); }
            .login-input:focus { border-color: #fff !important; background: rgba(255, 255, 255, 0.15) !important; }
          `}
        </style>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.5px' }}>Welcome Back</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px' }}>Login to manage your premium properties</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)' }}>Email Address</label>
            <input 
              className="login-input"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com" 
              required
              style={{ 
                width: '100%', 
                padding: '14px 18px', 
                borderRadius: '12px', 
                background: 'rgba(255, 255, 255, 0.1)', 
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: 'rgba(255, 255, 255, 0.9)' }}>Password</label>
            <input 
              className="login-input"
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
              style={{ 
                width: '100%', 
                padding: '14px 18px', 
                borderRadius: '12px', 
                background: 'rgba(255, 255, 255, 0.1)', 
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button 
            type="submit" 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
              width: '100%', 
              padding: '16px', 
              borderRadius: '12px', 
              border: 'none',
              background: isHovered ? '#fff' : 'rgba(255, 255, 255, 0.95)',
              color: '#1a1a1a',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: isHovered ? '0 10px 20px rgba(0,0,0,0.2)' : 'none'
            }}
          >
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Don't have an account? </span>
          <Link to="/register" style={{ 
            color: '#fff', 
            textDecoration: 'none', 
            fontWeight: '600',
            borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
            paddingBottom: '2px',
            transition: 'all 0.3s ease'
          }}>Register Now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
