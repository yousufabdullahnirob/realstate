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
        <Link className="active" to="/admin/">📊 Dashboard</Link>
        <Link to="/admin/projects">🏗 Manage Projects</Link>
        <Link to="/admin/apartments">🏢 Manage Apartments</Link>
        <Link to="/admin/bookings">📅 Bookings</Link>
        <Link to="/admin/inquiries">💬 Inquiries</Link>
        <Link to="/admin/notifications">🔔 Notifications</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
