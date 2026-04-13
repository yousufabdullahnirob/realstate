import React from 'react';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import { Outlet, Navigate } from 'react-router-dom';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const token = localStorage.getItem('access');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token || (user.role !== 'admin' && user.role !== 'agent')) {
    return <Navigate to="/login" replace />;
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="admin-container">
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="main-content">
        <Topbar onToggleSidebar={toggleSidebar} />
        <main className="admin-content page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

