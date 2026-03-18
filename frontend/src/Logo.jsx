import React from 'react';

const Logo = ({ className = '', ...props }) => {
  return (
    <img src="/src/assets/logo.svg" alt="Mahim Builders Logo" className={className} {...props} />
  );
};

export default Logo;

