import { Link } from "react-router-dom";
import Logo from '../Logo';

const Sidebar = () => {
  const menuItems = [
    { path: "/admin/", label: "Dashboard", icon: <path d="M3 13.125h7v-10H3v10Zm0 8.75h7v-7H3v7Zm8.75 0h7v-10h-7v10Zm0-18.75v7h7v-7h-7Z"/> },
    { path: "/admin/projects", label: "Projects", icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/> },
    { path: "/admin/apartments", label: "Apartments", icon: <path d="M3 21h18M3 7V1h18v20M8 1v20M13 1v20"/> },
    { path: "/admin/bookings", label: "Bookings", icon: <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/> },
    { path: "/admin/inquiries", label: "Inquiries", icon: <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/> },
    { path: "/admin/notifications", label: "Notifications", icon: <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/> },
    { path: "/", label: "Back to Website", icon: <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/> },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <Logo />
        
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path} className={window.location.pathname === item.path ? "active" : ""}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {item.icon}
            </svg>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
