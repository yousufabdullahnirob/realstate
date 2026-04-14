import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../Logo';

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <div className="logo">
          <Logo />
        </div>
        <nav className="nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/apartments">Apartments</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
        <div className="header-auth">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="auth-link">
                Welcome, {user.full_name}
              </Link>
              <button onClick={handleLogout} className="contact-btn" style={{ padding: '8px 15px' }}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="auth-link">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

