
// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getCurrentUser } from "../api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await getCurrentUser();
      setUser(userData);

      // Store organizationId only if available
      if (userData && userData.organization_id) {
        localStorage.setItem("organizationId", userData.organization_id);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Only logout on token-related errors, not general 403s
      if (
        (error && error.message && error.message.includes("401")) ||
        error?.status === 401 ||
        (error?.status === 403 && error.message?.includes("Invalid token"))
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("organizationId");
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (loginResponse) => {
    if (!loginResponse) {
      console.error("Login error: loginResponse is undefined or null");
      toast.error("Login failed: Response missing.");
      return;
    }

    // Support both shapes: { access_token, user } OR full response already
    const access_token = loginResponse.access_token ?? loginResponse.token ?? null;
    const userObj = loginResponse.user ?? loginResponse?.data ?? null;

    if (!userObj) {
      console.error("Login error: User object is missing in loginResponse", loginResponse);
      toast.error("Login failed: User data missing from server response.");
      return;
    }

    if (!access_token) {
      console.warn("Warning: access_token not found in login response.", loginResponse);
      // Still proceed to set user if you want, but better to require token
    }

    setUser(userObj);

    if (access_token) localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(userObj));

    const userName = userObj.full_name ?? userObj.name ?? userObj.email?.split("@")[0] ?? "User";
    localStorage.setItem("userName", userName);
    if (userObj.role) localStorage.setItem("userRole", userObj.role);

    // Save organization id if present
    if (userObj.organization_id) {
      localStorage.setItem("organizationId", userObj.organization_id);
    } else {
      // Keep existing org id if present — but warn
      console.warn("organization_id missing in user object:", userObj);
      // localStorage.removeItem("organizationId");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("organizationId");
  };

  const isSuperAdmin = () => user?.role === "super_admin";
  const isAdmin = () => user?.role === "admin" || user?.role === "super_admin";
  const isMember = () => user?.role === "member";
  const isAuthenticated = () => !!user;

  const canSendInvitations = () => isAdmin();
  const canManageUsers = () => isAdmin();
  const canManageProjects = () => isAdmin();
  const canManageTasks = () => isAdmin();
  const canViewDashboard = () => isAuthenticated();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated,
        isSuperAdmin,
        isAdmin,
        isMember,
        canSendInvitations,
        canManageUsers,
        canManageProjects,
        canManageTasks,
        canViewDashboard,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
