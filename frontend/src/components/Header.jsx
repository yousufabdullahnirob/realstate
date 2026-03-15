import React from 'react';
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
            <li><a href="/">Home</a></li>
            <li><a href="/apartments">Apartments</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/projects">Projects</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
        <a href="/contact" className="contact-btn">Contact Us</a>
      </div>
    </header>
  );
};

export default Header;

