// src/api/projects.js
// const API_URL = import.meta.env.VITE_API_URL?.trim() || "http://127.0.0.1:8000";
const API_URL = import.meta.env.VITE_API_URL?.trim() || "https://teamflow-backend-1tt9.onrender.com";

function authHeaders() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found — please log in again");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function getOrganizationId() {
  const orgId = localStorage.getItem("organizationId");
  if (!orgId) throw new Error("No organization ID found — please log in again");
  return parseInt(orgId);
}

/* --------------------  GET ALL PROJECTS (Organization-scoped)  -------------------- */
export async function getProjects() {
  const organizationId = getOrganizationId();
  
  const res = await fetch(`${API_URL}/projects/?organization_id=${organizationId}`, {
    headers: authHeaders(),
  });

  const result = await res.json();
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("organizationId");
      window.location.href = "/login";
    }
    throw new Error(result.detail || "Failed to load projects");
  }
  return result;
}

/* --------------------  GET SINGLE PROJECT  -------------------- */
export async function getProject(id) {
  const organizationId = getOrganizationId();
  
  const res = await fetch(`${API_URL}/projects/${id}?organization_id=${organizationId}`, {
    headers: authHeaders(),
  });
  
  const result = await res.json();
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("organizationId");
      window.location.href = "/login";
    }
    throw new Error(result.detail || "Failed to load project");
  }
  return result;
}

/* --------------------  CREATE PROJECT  -------------------- */
export async function createProject(data) {
  const organizationId = getOrganizationId();
  
  // Include organization_id in project creation
  const projectData = {
    ...data,
    organization_id: organizationId
  };

  const res = await fetch(`${API_URL}/projects/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(projectData),
  });

  const result = await res.json();
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("organizationId");
      window.location.href = "/login";
    }
    throw new Error(result.detail || "Create failed");
  }
  return result;
}

/* --------------------  UPDATE PROJECT  -------------------- */
export async function updateProject(id, data) {
  const organizationId = getOrganizationId();
  
  // Include organization_id to ensure user can only update their org's projects
  const projectData = {
    ...data,
    organization_id: organizationId
  };

  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(projectData),
  });

  const result = await res.json();
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("organizationId");
      window.location.href = "/login";
    }
    throw new Error(result.detail || "Update failed");
  }
  return result;
}

/* --------------------  DELETE PROJECT  -------------------- */
export async function deleteProject(id) {
  const organizationId = getOrganizationId();
  
  const res = await fetch(`${API_URL}/projects/${id}?organization_id=${organizationId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("organizationId");
      window.location.href = "/login";
    }
    const result = await res.json();
    throw new Error(result.detail || "Delete failed");
  }
  return true;
}

/* --------------------  GET PROJECTS BY ORGANIZATION  -------------------- */
export async function getProjectsByOrganization(organizationId) {
  const res = await fetch(`${API_URL}/projects/?organization_id=${organizationId}`, {
    headers: authHeaders(),
  });

  const result = await res.json();
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("organizationId");
      window.location.href = "/login";
    }
    throw new Error(result.detail || "Failed to load projects");
  }
  return result;
}