import { NavLink } from "react-router-dom";
import Logo from '../Logo';

const Sidebar = () => (
  <aside className="sidebar">
    <Logo />
    <nav className="sidebar-nav">
      <NavLink to="/admin" end className={({ isActive }) => isActive ? "active" : ""}>
        <span className="icon">🏠</span> Dashboard
      </NavLink>
      <NavLink to="/admin/projects" className={({ isActive }) => isActive ? "active" : ""}>
        <span className="icon">🏗️</span> Projects
      </NavLink>
      <NavLink to="/admin/apartments" className={({ isActive }) => isActive ? "active" : ""}>
        <span className="icon">🏢</span> Apartments
      </NavLink>
      <NavLink to="/admin/bookings" className={({ isActive }) => isActive ? "active" : ""}>
        <span className="icon">📑</span> Bookings
      </NavLink>
      <NavLink to="/admin/payments" className={({ isActive }) => isActive ? "active" : ""}>
        <span className="icon">💳</span> Payments
      </NavLink>
      <NavLink to="/admin/inquiries" className={({ isActive }) => isActive ? "active" : ""}>
        <span className="icon">📬</span> Inquiries
      </NavLink>
      <NavLink to="/admin/notifications" className={({ isActive }) => isActive ? "active" : ""}>
        <span className="icon">🔔</span> Notifications
      </NavLink>
    </nav>
  </aside>
);

export default Sidebar;
