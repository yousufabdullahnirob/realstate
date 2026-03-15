import { Link } from "react-router-dom";
import logo from "../assets/logo.svg"; // adjust path if needed
import "../admin.css";


const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo">
        <img src={logo} alt="Company Logo" />
        <div className="logo-text">Mahim Builders</div>
      </div>

      <nav className="sidebar-nav">
        <Link className="active" to="/">📊 Dashboard</Link>
        <Link to="/projects">🏗 Projects</Link>
        <Link to="/apartments">🏢 Apartments</Link>
        <Link to="/bookings">📅 Bookings</Link>
        <Link to="/users">👤 Users</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
