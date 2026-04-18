import React from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from '../Logo';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: <path d="M3 3h7v9H3zm11 0h7v5h-7zm0 9h7v9h-7zm-11 10h7v-7H3z"/> },
    { path: "/admin/projects", label: "Projects", icon: <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm14 12h-8v-2h8v2zm0-4h-8v-2h8v2zm0-4h-8V9h8v2z"/> },
    { path: "/admin/apartments", label: "Apartments", icon: <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/> },
    { path: "/admin/bookings", label: "Bookings", icon: <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/> },
    { path: "/admin/inquiries", label: "Inquiries", icon: <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/> },
    { path: "/admin/users", label: "Users", icon: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/> },
    { path: "/admin/notifications", label: "Notifications", icon: <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/> },
    { path: "/", label: "Back to Website", icon: <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/> },
  ];

  const checkActive = (path) => {
    if (path === "/admin") return location.pathname === "/admin";
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="sidebar">
      <div className="logo" style={{ marginBottom: '40px' }}>
        <Logo />
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={checkActive(item.path) ? "active" : ""}
            onClick={onClose}
          >

            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              {item.icon}
            </svg>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
