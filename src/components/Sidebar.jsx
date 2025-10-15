// src/components/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
// Import professional icons
import { 
  FiHome, 
  FiFolder, 
  FiCheckSquare, 
  FiUser, 
  FiBarChart2, 
  FiLogOut,
  FiUsers,
  FiFileText
} from "react-icons/fi";

export default function Sidebar() {
  const nav = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState("");

  // Get user role from localStorage on mount
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role || "");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out");
    nav("/login");
  };

  /* helper to highlight the active route */
  const isActive = (path) => (location.pathname === path ? "active" : "");

  // ✅ FIXED: Check if user is admin OR super_admin
  const isAdminUser = userRole === "admin" || userRole === "super_admin";

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="logo">TeamFlow</h2>
        <p className="tagline">
          {isAdminUser ? "Admin Panel" : "Member Panel"}
        </p>
      </div>

      <nav className="sidebar-nav">
        {/* ------------ Role-based buttons ------------ */}
        {isAdminUser ? (
          <>
            <button
              className={`sidebar-btn ${isActive("/admin")}`}
              onClick={() => nav("/admin")}
            >
              <FiHome className="sidebar-icon" />
              <span>Dashboard</span>
            </button>

            <button
              className={`sidebar-btn ${isActive("/projects")}`}
              onClick={() => nav("/projects")}
            >
              <FiFolder className="sidebar-icon" />
              <span>Create Projects</span>
            </button>

            <button
              className={`sidebar-btn ${isActive("/create-task")}`}
              onClick={() => nav("/create-task")}
            >
              <FiCheckSquare className="sidebar-icon" />
              <span>Create Tasks</span>
            </button>

            <button
              className={`sidebar-btn ${isActive("/invite-user")}`}
              onClick={() => nav("/invite-user")}
            >
              <FiUser className="sidebar-icon" />
              <span>Invite Users</span>
            </button>

            <button
              className={`sidebar-btn ${isActive("/reports")}`}
              onClick={() => nav("/reports")}
            >
              <FiBarChart2 className="sidebar-icon" />
              <span>Reports</span>
            </button>
          </>
        ) : (
          <>
            {/* Member buttons */}
            <button
              className={`sidebar-btn ${isActive("/member")}`}
              onClick={() => nav("/member")}
            >
              <FiHome className="sidebar-icon" />
              <span>Dashboard</span>
            </button>
          </>
        )}
        {/* ---------------------------------------- */}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut className="sidebar-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}