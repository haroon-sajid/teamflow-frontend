// src/pages/MemberProfile.jsx
import Layout from "../components/Layout";
import { useEffect, useState } from "react";

export default function MemberProfile() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "",
    created_at: "",
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail"); // If you save it
    const userRole = localStorage.getItem("userRole");

    if (userId) {
      setUserData({
        name: userName || "Unknown",
        email: userEmail || "Not available",
        role: userRole || "member",
        created_at: new Date().toLocaleDateString(), // Replace with real data later
      });
    }
  }, []);

  return (
    <Layout>
      <div className="page-header">
        <h1>Your Profile</h1>
        <p>Manage your account details.</p>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          {userData.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="profile-info">
          <h3>{userData.name}</h3>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Role:</strong> {userData.role}</p>
          <p><strong>Joined:</strong> {userData.created_at}</p>
        </div>
      </div>
    </Layout>
  );
}