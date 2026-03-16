import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiProxy from '../utils/proxyClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await apiProxy.post('/login/', { email, password });
      
      // Store globally relevant data
      localStorage.setItem('access', response.access);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      // Force refresh for navbar name update
      window.location.reload();
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '150px', maxWidth: '400px', margin: '0 auto' }}>
      <div className="form-card">
        <h2>Sign In</h2>
        <p>Access your Mahim Builders account.</p>
        <form onSubmit={handleLogin}>
          {error && <div style={{ color: 'red', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="contact-btn" style={{ width: '100%' }}>Login</button>
        </form>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Register Now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
