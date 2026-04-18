import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import apiProxy from '../utils/proxyClient';
import registerBg from '../assets/Register_bg.avif';

const Register = () => {
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    role: 'customer' 
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const redirectMessage = location.state?.message;


  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await apiProxy.post('/register/', {
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        role: formData.role
      });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', inset: -20,
        backgroundImage: `url(${registerBg})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(8px)', zIndex: 0
      }} />
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 0 }} />
      
      <div className="form-card glass-premium" style={{ position: 'relative', zIndex: 1, maxWidth: '450px', width: '90%', padding: '40px', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.9)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Create Account</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>Join Mahim Builders' community.</p>
        <form onSubmit={handleRegister}>
          {redirectMessage && (
            <div style={{ 
              background: '#eff6ff', 
              color: '#1d4ed8', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '15px',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'center',
              border: '1px solid #dbeafe'
            }}>
              ℹ️ {redirectMessage}
            </div>
          )}
          {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
          </div>
          <button type="submit" className="contact-btn" style={{ width: '100%' }}>Register</button>
        </form>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
