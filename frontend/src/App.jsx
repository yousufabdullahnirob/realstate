import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import PublicLayout from "./PublicLayout";
import AdminLayout from "./AdminLayout";
import ClientLayout from "./ClientLayout";
const Home = lazy(() => import("./pages/Home"));
const Projects = lazy(() => import("./pages/Projects"));
const ApartmentListing = lazy(() => import("./pages/ApartmentListing"));
const ApartmentDetails = lazy(() => import("./pages/ApartmentDetails"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const ProjectForm = lazy(() => import("./pages/ProjectForm"));
const ApartmentForm = lazy(() => import("./pages/ApartmentForm"));
const Bookings = lazy(() => import("./pages/Bookings"));
const Inquiries = lazy(() => import("./pages/Inquiries"));
const Notifications = lazy(() => import("./pages/Notifications"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ClientDashboard = lazy(() => import("./pages/ClientDashboard"));
const ApartmentAdmin = lazy(() => import("./pages/ApartmentAdmin"));
const ProjectAdmin = lazy(() => import("./pages/ProjectAdmin"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const PaymentManagement = lazy(() => import("./pages/PaymentManagement"));
const UserManagement = lazy(() => import("./pages/UserManagement"));
const DesignShowcase = lazy(() => import("./pages/DesignShowcase"));
const Services = lazy(() => import("./pages/Services"));
const SubmitPayment = lazy(() => import("./pages/SubmitPayment"));
import "./admin.css";
import "./styles.css";

export default function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <div style={{ padding: '120px 20px', textAlign: 'center' }}>
            Loading...
          </div>
        }
      >
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
            <Route path="/register" element={<Register />} />
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
      </Suspense>
    </Router>
  );
}
