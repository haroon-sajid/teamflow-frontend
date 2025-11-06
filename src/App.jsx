// src/App.jsx
import React from "react";
import "./index.css";
import { Routes, Route } from "react-router-dom";
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
import TimeSheet from './pages/TimeSheet'; // ✅ Added TimeSheet import

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
// ✅ App Component
// =========================================
function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/projects" element={<CreateProjects />} />
        <Route path="/create-task" element={<CreateTasks />} />
        <Route path="/invite-user" element={<InviteUser />} />
        <Route path="/accept-invitation" element={<AcceptInvitation />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/support" element={<HelpSupport />} />
        <Route path="/timesheet" element={<TimeSheet />} /> {/* ✅ Added TimeSheet route */}

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