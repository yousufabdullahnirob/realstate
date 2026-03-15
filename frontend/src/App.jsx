import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminHeader from "./components/AdminHeader";
import Sidebar from "./components/Sidebar";
import AdminDashboard from "./pages/AdminDashboard";
import ApartmentAdmin from "./pages/ApartmentAdmin";
import ProjectAdmin from "./pages/ProjectAdmin";
import "./admin.css";

export default function App() {
  return (
    <Router>
      <div className="admin-app">
        <AdminHeader title="Admin Panel" />
        <div className="admin-layout">
          <Sidebar />
          <main className="admin-content">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/projects" element={<ProjectAdmin />} />
              <Route path="/apartments" element={<ApartmentAdmin />} />
              {/* Add Bookings and Users later */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
