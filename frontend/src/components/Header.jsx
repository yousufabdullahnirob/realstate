import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../Logo';
import ThemeToggle from './ThemeToggle';

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
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s

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
          <ul style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <li><a href="/">Home</a></li>
            <li><a href="/apartments">Apartments</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/projects">Projects</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
        <div className="header-auth" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <ThemeToggle />
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Link to="/notifications" className="auth-link" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span style={{ 
                  position: 'absolute', 
                  top: '-5px', 
                  right: '-5px', 
                  backgroundColor: '#f44336', 
                  color: 'white', 
                  fontSize: '10px', 
                  padding: '2px 5px', 
                  borderRadius: '10px',
                  display: unreadCount > 0 ? 'block' : 'none'
                }}>{unreadCount}</span>
              </Link>
              <Link to="/profile" className="auth-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {user.profile_image ? (
                  <img src={user.profile_image} alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white' }}>
                    {user.full_name.charAt(0)}
                  </div>
                )}
                <span>Profile</span>
              </Link>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="auth-link">
                Dashboard
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

