import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiProxy from '../utils/proxyClient';

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
    <div className="container" style={{ paddingTop: '150px', maxWidth: '400px', margin: '0 auto' }}>
      <div className="form-card">
        <h2>Create Account</h2>
        <p>Join Mahim Builders' community.</p>
        <form onSubmit={handleRegister}>
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
