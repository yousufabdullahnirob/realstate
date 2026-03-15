import React from 'react';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="admin-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <main className="admin-content page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

