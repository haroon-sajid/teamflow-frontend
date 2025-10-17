
// src/pages/AdminDashboard.jsx
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getProjects } from "../api/projects.js";
import { getTasks } from "../api/tasks.js";
import { getOrganizationMembers } from "../api/getMembers"; 

export default function AdminDashboard() {
  const nav = useNavigate();
  const [userName, setUserName] = useState("");
  const [members, setMembers] = useState([]); // ✅ new state
  const [stats, setStats] = useState({
    projects: 0,
    members: 0,
    tasks: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const name = localStorage.getItem("userName");

    if (role !== "admin" && role !== "super_admin") {
      toast.error("Access denied");
      nav("/login");
      return;
    }

    setUserName(name || "Admin");
    loadDashboardStats();
    getOrganizationMembers(); // ✅ load members too
  }, [nav]);

  const loadDashboardStats = async () => {
  try {
    setLoading(true);

    const [projectsData, tasksData, membersData] = await Promise.all([
      getProjects(),
      getTasks(),
      getOrganizationMembers(),
    ]);

    const projectCount = Array.isArray(projectsData) ? projectsData.length : 0;
    const taskCount = Array.isArray(tasksData) ? tasksData.length : 0;
    const completedTaskCount = Array.isArray(tasksData)
      ? tasksData.filter((task) => task.status === "Done").length
      : 0;
    const memberCount = Array.isArray(membersData) ? membersData.length : 0;

    setStats({
      projects: projectCount,
      members: memberCount,
      tasks: taskCount,
      completedTasks: completedTaskCount,
    });
    setMembers(membersData); // ✅ added here
  } catch (error) {
    console.error("Dashboard stats error:", error);
    toast.error(error.message || "Failed to load dashboard stats");
    setStats({
      projects: 0,
      members: 0,
      tasks: 0,
      completedTasks: 0,
    });
    setMembers([]);
  } finally {
    setLoading(false);
  }
};


  // ✅ Load organization members list
  const loadOrganizationMembers = async () => {
    try {
      const data = await getOrganizationMembers();
      setMembers(data);
    } catch (error) {
      console.error("Failed to load members:", error);
      toast.error("Failed to load organization members");
      setMembers([]);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p className="subtitle">Welcome, {userName}! Manage your organization and projects.</p>
        {localStorage.getItem("userRole") === "super_admin" && (
          <div className="super-admin-badge">SUPER ADMIN</div>
        )}
      </div>

      <div className="quick-actions">
        <div className="action-buttons">
          <button className="primary-btn" onClick={() => nav("/projects")}>
            + Create Project
          </button>
          <button className="primary-btn" onClick={() => nav("/create-task")}>
            + Create Task
          </button>
          <button className="primary-btn" onClick={() => nav("/invite-user")}>
            + Invite User
          </button>
          <button className="secondary-btn" onClick={() => nav("/reports")}>
            📊 View Reports
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading dashboard statistics...</div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon projects">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
              </div>
              <div className="stat-content">
                <h3>{stats.projects}</h3>
                <p>Projects</p>
              </div>
            </div>
            <div className="stat-footer">Active projects in your organization</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon members">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <div className="stat-content">
                <h3>{stats.members}</h3>
                <p>Team Members</p>
              </div>
            </div>
            <div className="stat-footer">Members in your organization</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon tasks">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>
              </div>
              <div className="stat-content">
                <h3>{stats.tasks}</h3>
                <p>Total Tasks</p>
              </div>
            </div>
            <div className="stat-footer">Tasks across all projects</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon completed">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div className="stat-content">
                <h3>{stats.completedTasks}</h3>
                <p>Completed</p>
              </div>
            </div>
            <div className="stat-footer">Tasks finished this period</div>
          </div>
        </div>
      )}

      {/* ✅ Organization Members Table */}
      <div className="project-list">
        <div className="card-header">
          <h2>Organization Members</h2>
          <button className="add-btn" onClick={() => nav("/invite-user")}>
            + Invite User
          </button>
        </div>

        <div className="table-wrapper">
          <table className="project-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? (
                members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.id}</td>
                    <td>{member.full_name || "—"}</td>
                    <td>{member.email}</td>
                    <td className="capitalize">{member.role}</td>
                    <td>{member.is_active ? "✅ Active" : "🕓 Pending"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty">
                    <div className="empty">
                      <p className="empty-title">No members found</p>
                      <p className="empty-subtitle">Invite users to join your organization</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}