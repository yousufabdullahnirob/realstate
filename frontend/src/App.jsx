import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "./PublicLayout";
import AdminLayout from "./AdminLayout";
import ClientLayout from "./ClientLayout";
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
import ClientDashboard from "./pages/ClientDashboard";
import ApartmentAdmin from "./pages/ApartmentAdmin";
import ProjectAdmin from "./pages/ProjectAdmin";
import Login from "./pages/Login";
import Register from "./pages/Register"; // FIX: Was imported nowhere — Login links to /register but route was missing
import PaymentManagement from "./pages/PaymentManagement";
import UserManagement from "./pages/UserManagement";
import DesignShowcase from "./pages/DesignShowcase";
import Services from "./pages/Services";
import SubmitPayment from "./pages/SubmitPayment";
import "./admin.css";
import "./styles.css";

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* FIX: Added missing /register route */}
          <Route path="/design-showcase" element={<DesignShowcase />} />
          <Route path="/services" element={<Services />} />
        </Route>
        {/* Admin routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/projects" element={<ProjectAdmin />} />
          <Route path="/admin/projects/new" element={<ProjectForm />} />
          <Route path="/admin/projects/edit/:id" element={<ProjectForm />} />
          <Route path="/admin/apartments" element={<ApartmentAdmin />} />
          <Route path="/admin/apartments/new" element={<ApartmentForm />} />
          <Route path="/admin/apartments/edit/:id" element={<ApartmentForm />} />
          <Route path="/admin/payments" element={<PaymentManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/bookings" element={<Bookings />} />
          <Route path="/admin/inquiries" element={<Inquiries />} />
          <Route path="/admin/notifications" element={<Notifications />} />
        </Route>
        {/* Client routes */}
        <Route element={<ClientLayout />}>
          <Route path="/dashboard" element={<ClientDashboard />} />
          <Route path="/submit-payment" element={<SubmitPayment />} />
        </Route>
      </Routes>
    </Router>
  );
}
