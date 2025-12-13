// src/App.jsx

import "./index.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { Toaster } from "react-hot-toast";
import axios from "axios";

// 🔹 Pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CreateTasks from "./pages/CreateTasks";
import AdminDashboard from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import CreateProjects from "./pages/CreateProjects";
import AcceptInvitation from "./pages/AcceptInvitation";
import InviteUser from "./pages/InviteUser";
import Reports from "./pages/Reports";
import ProfilePage from './components/profile/ProfilePage';
import HelpSupport from './pages/HelpSupport';
import TimeSheet from './pages/TimeSheet';
import CheckInOut from './pages/CheckInOut';
import ManagerAttendance from './pages/ManagerAttendance';
import TeamManagement from './pages/TeamManagement';
import Leave from './pages/Leave'; // ✅ Added Leave import
import LandingPage from './pages/LandingPage'; // ✅ Added Landing Page import


import PlansPage from './pages/PlansPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';

// =========================================
// ✅ Axios Interceptor for Token Auth
// =========================================
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// =========================================
// ✅ Protected Route Component
// =========================================
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth(); // Assuming useAuth provides loading state
  const token = localStorage.getItem("token"); // Fallback check

  if (loading) return <div>Loading...</div>;
  if (!user && !token) return <Navigate to="/login" />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
    // Or redirect to their dashboard
    // return <Navigate to={user.role === 'admin' ? '/admin' : '/member'} />;
  }

  return children;
};

// =========================================
// ✅ App Component
// =========================================
function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} /> */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/projects" element={<CreateProjects />} />
        <Route path="/create-task" element={<CreateTasks />} />
        <Route path="/invite-user" element={<InviteUser />} />
        <Route path="/accept-invitation" element={<AcceptInvitation />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/support" element={<HelpSupport />} />
        <Route path="/timesheet" element={<TimeSheet />} />

        {/* Role-based Attendance Routes */}
        <Route path="/attendance" element={
          <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
            <ManagerAttendance />
          </ProtectedRoute>
        } />

        {/* Team Management - Admin Only */}
        <Route path="/team-management" element={
          <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
            <TeamManagement />
          </ProtectedRoute>
        } />

        <Route path="/my-attendance" element={
          <ProtectedRoute>
            <CheckInOut />
          </ProtectedRoute>
        } />

        {/* Legacy route alias */}
        <Route path="/check-in-out" element={<CheckInOut />} />
        <Route path="/leave" element={<Leave />} /> {/* ✅ Added Leave route */}

        {/* 🔥 FIX: Update these routes to match Stripe redirect URLs */}
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />

        {/* Remove these duplicate routes or keep them as aliases */}
        {/* <Route path="/payment-success" element={<PaymentSuccess />} /> */}
        {/* <Route path="/payment-cancel" element={<PaymentCancel />} /> */}

        {/* ✅ Remove these duplicates - they're already defined above */}
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
        {/* <Route path="/plans" element={<PlansPage />} /> */}
        {/* <Route path="/support" element={<HelpSupport />} /> */}
      </Routes>
    </>
  );
}

export default App;