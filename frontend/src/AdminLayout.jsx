import React from 'react';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <main className="admin-content page-content">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

