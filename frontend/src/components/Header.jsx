import { Link, NavLink, useNavigate } from 'react-router-dom';
import Logo from '../Logo';

const Header = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="container nav-container">
        <div className="logo">
          <Logo />
        </div>
        <nav className="nav">
          <ul>
            <li><NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink></li>
            <li><NavLink to="/apartments" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Apartments</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>About Us</NavLink></li>
            <li><NavLink to="/projects" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Projects</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Contact</NavLink></li>
            <li><NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Login</NavLink></li>
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
            <>
              <Link to="/login" className="auth-link">Login</Link>
              <Link to="/register" className="contact-btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

