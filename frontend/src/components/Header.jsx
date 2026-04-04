import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../Logo';
import ThemeToggle from './ThemeToggle';
import apiProxy from '../utils/proxyClient';

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    const fetchUnreadCount = async () => {
      if (user) {
        try {
          const data = await apiProxy.get("/notifications/");
          setUnreadCount(data.filter(n => !n.is_read).length);
        } catch (error) {
          console.error("Failed to fetch unread count:", error);
        }
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, [user]);

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
            <li><a href="/">Overview</a></li>
            <li><a href="/apartments">Collection</a></li>
            <li><a href="/projects">Design Hub</a></li>
            <li><a href="/about">Our Vision</a></li>
            <li><a href="/contact">Inquiry</a></li>
          </ul>
        </nav>
        <div className="header-auth">
          <ThemeToggle />
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <Link to="/notifications" className="auth-link" style={{ position: 'relative' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unreadCount > 0 && (
                  <span style={{ 
                    position: 'absolute', 
                    top: '-4px', 
                    right: '-4px', 
                    backgroundColor: 'var(--primary)', 
                    width: '12px', 
                    height: '12px',
                    borderRadius: '50%',
                    border: '2px solid var(--white)'
                  }}></span>
                )}
              </Link>
              <Link to="/profile" className="auth-link" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--bg-main)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800' }}>
                  {user.full_name.charAt(0)}
                </div>
                <span className="nav-label">{user.full_name}</span>
              </Link>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="auth-link" style={{ color: 'var(--primary)' }}>
                Console
              </Link>
              <button onClick={handleLogout} className="contact-btn" style={{ padding: '10px 24px', fontSize: '13px', fontWeight: '800' }}>Global Logout</button>
            </div>
          ) : (
            <Link to="/login" className="auth-link" style={{ fontWeight: '800' }}>Member Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

