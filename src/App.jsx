// src/App.jsx
import React from "react";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";   

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CreateTasks from "./pages/CreateTasks";
import AdminDashboard from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import CreateProjects from "./pages/CreateProjects";
import AcceptInvitation from "./pages/AcceptInvitation"; 
import InviteUser from "./pages/InviteUser";
import Reports from "./pages/Reports";


// src/main.jsx
import axios from 'axios';

// Set token on every request
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  return (
    <>
      <Toaster position="top-center"/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/member" element={<MemberDashboard/>} />
        <Route path="/projects" element={<CreateProjects />} />
        <Route path="/create-task" element={<CreateTasks />} />
        <Route path="/invite-user" element={<InviteUser />} /> 
        <Route path="/accept-invitation" element={<AcceptInvitation />} /> 
        <Route path="/reports" element={<Reports />} /> 
      </Routes>
    </>
  );
}
export default App;
