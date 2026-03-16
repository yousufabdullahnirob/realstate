import { Link } from "react-router-dom";
import Logo from '../Logo';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo">
        <Logo />
        <div className="logo-text">Mahim Builders</div>
      </div>

      <nav className="sidebar-nav">
        <Link className="active" to="/admin/"><span>📊</span> Dashboard</Link>
        <Link to="/admin/projects"><span>🏗</span> Manage Projects</Link>
        <Link to="/admin/apartments"><span>🏢</span> Manage Apartments</Link>
        <Link to="/admin/bookings"><span>📅</span> Bookings</Link>
        <Link to="/admin/inquiries"><span>💬</span> Inquiries</Link>
        <Link to="/admin/notifications"><span>🔔</span> Notifications</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
