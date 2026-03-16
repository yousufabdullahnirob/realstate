import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../Logo';

const Header = () => {
  return (
    <header className="header">
      <div className="container nav-container">
        <div className="logo">
        <Logo />
        </div>
        <nav className="nav">
          <ul>
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Home</NavLink></li>
            <li><NavLink to="/apartments" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Apartments</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>About Us</NavLink></li>
            <li><NavLink to="/projects" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Projects</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Contact</NavLink></li>
          </ul>
        </nav>
        <NavLink to="/contact" className="contact-btn">Contact Us</NavLink>
      </div>
    </header>
  );
};

export default Header;

