import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const ClientLayout = () => {
  const token = localStorage.getItem('access');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token || user.role !== 'customer') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Outlet />
    </div>
  );
};

export default ClientLayout;