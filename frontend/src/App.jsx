import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "./PublicLayout";
import AdminLayout from "./AdminLayout";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ApartmentListing from "./pages/ApartmentListing";
import ApartmentDetails from "./pages/ApartmentDetails";
import AboutUs from "./pages/AboutUs";
import ProjectDetails from "./pages/ProjectDetails";
import ContactUs from "./pages/ContactUs";
import ProjectForm from "./pages/ProjectForm";
import ApartmentForm from "./pages/ApartmentForm";
import Bookings from "./pages/Bookings";
import Inquiries from "./pages/Inquiries";
import Notifications from "./pages/Notifications";
import AdminDashboard from "./pages/AdminDashboard";
import ApartmentAdmin from "./pages/ApartmentAdmin";
import ProjectAdmin from "./pages/ProjectAdmin";
import PaymentAdmin from "./pages/PaymentAdmin";
import PaymentDashboard from "./pages/PaymentDashboard";
import "./admin.css";
import "./styles.css"; // Public site styles

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/apartments" element={<ApartmentListing />} />
          <Route path="/apartments/:id" element={<ApartmentDetails />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
        </Route>
        {/* Admin routes */}
        <Route path="/admin/payments" element={<AdminLayout><PaymentAdmin /></AdminLayout>} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<ProjectAdmin />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/edit/:id" element={<ProjectForm />} />
          <Route path="apartments" element={<ApartmentAdmin />} />
          <Route path="apartments/new" element={<ApartmentForm />} />
          <Route path="apartments/edit/:id" element={<ApartmentForm />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="inquiries" element={<Inquiries />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="payments" element={<PaymentAdmin />} />
        </Route>
        {/* User payment dashboard */}
        <Route path="/payments" element={<PaymentDashboard />} />
      </Routes>
    </Router>
  );
}
