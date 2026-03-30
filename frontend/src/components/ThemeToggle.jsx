import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="theme-toggle"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        background: 'var(--glass)',
        border: '1px solid var(--glass-border)',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--text-dark)',
        fontSize: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </motion.button>
  );
};

export default ThemeToggle;
