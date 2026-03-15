import React from 'react';

const Logo = ({ className = '' }) => {
  return (
    <img src="/src/assets/logo.svg" alt="Mahim Builders Logo" className={className} />
  );
};

export default Logo;

