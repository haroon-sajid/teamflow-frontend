// src/api/users.js
// const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
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

/* --------------------  GET CURRENT USER PROFILE  -------------------- */
export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: authHeaders(),
  });

  const result = await res.json();
  if (!res.ok) {
    // Handle authentication errors
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("organizationId");
      window.location.href = "/login";
    }
    const msg = result.detail || result.message || "Failed to fetch current user";
    throw new Error(msg);
  }

  return result;
}


/* -----------  GET ORG-SCOPED USERS (ADMIN DASHBOARD)  ----------- */
export async function getUsers() {
  const res = await fetch(`${API_URL}/users/`, {   // <- clean URL
    headers: authHeaders(),
  });

  const result = await res.json();
  if (!res.ok) {
    if (res.status === 401) {
      // Unauthorized → clear login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("organizationId");
      window.location.href = "/login";
    } else if (res.status === 403) {
      // Forbidden → member not allowed to access this resource
      // Silently handle 403 for members to prevent console errors
      if (import.meta.env.DEV || import.meta.env.NODE_ENV === "development") {
        console.info("Member access restricted (403) — skipping users fetch.");
      }
      return []; // Return empty list instead of forcing logout
    }
    throw new Error(result.detail || `Unexpected response: ${res.status}`);
  }
  return result;
}

/* --------------------  GET USER BY ID  -------------------- */
export async function getUser(id) {
  const organizationId = getOrganizationId();
  
  const res = await fetch(`${API_URL}/users/${id}?organization_id=${organizationId}`, {
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
    
    // Handle specific forbidden case for members trying to access others
    if (res.status === 403) {
      throw new Error("You can only view users from your organization.");
    }
    const msg = result.detail || result.message || "Failed to load user";
    throw new Error(msg);
  }
  return result;
}

/* --------------------  UPDATE USER  -------------------- */
export async function updateUser(id, data) {
  const organizationId = getOrganizationId();
  
  // Include organization_id to ensure user can only update their org's users
  const userData = {
    ...data,
    organization_id: organizationId
  };

  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(userData),
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

/* --------------------  DELETE USER  -------------------- */
export async function deleteUser(id) {
  const organizationId = getOrganizationId();
  
  const res = await fetch(`${API_URL}/users/${id}?organization_id=${organizationId}`, {
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

/* --------------------  UPDATE CURRENT USER PROFILE  -------------------- */
export async function updateCurrentUserProfile(data) {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("organizationId");
      window.location.href = "/login";
    }
    throw new Error(result.detail || "Profile update failed");
  }
  return result;
}

/* --------------------  GET USERS BY ROLE  -------------------- */
export async function getUsersByRole(role) {
  const organizationId = getOrganizationId();
  
  const res = await fetch(`${API_URL}/users/?role=${role}&organization_id=${organizationId}`, {
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
    throw new Error(result.detail || "Failed to load users");
  }
  return result;
}

/* --------------------  SEARCH USERS  -------------------- */
export async function searchUsers(query) {
  const organizationId = getOrganizationId();
  
  const res = await fetch(`${API_URL}/users/search?q=${encodeURIComponent(query)}&organization_id=${organizationId}`, {
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
    throw new Error(result.detail || "Failed to search users");
  }
  return result;
}



/* -----------  GET ORG-SCOPED USERS (ADMIN DASHBOARD)  ----------- */
export async function getallUsers() {
  const res = await fetch(`${API_URL}/users/dashboard/members`, {
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
    throw new Error(result.detail || "Failed to load users");
  }
  return result;
}





/* --------------------  GET USERS (Member-Safe Version)  -------------------- */
export async function getUsersSafe() {
  try {
    const res = await fetch(`${API_URL}/users/`, {
      headers: authHeaders(),
    });

    if (res.status === 403) {
      // Member not allowed to access full user list
      return [];
    }

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.detail || "Failed to load users");
    }
    return result;
  } catch (error) {
    console.warn("⚠️ Member-safe getUsers failed:", error.message);
    return [];
  }
}






/* --------------------  UPDATE TASK STATUS (for drag-drop)  -------------------- */
export async function updateTaskStatus(taskId, newStatus) {
  const organizationId = getOrganizationId();

  const res = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({
      status: newStatus,
      organization_id: organizationId,
    }),
  });

  const result = await res.json();

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("organizationId");
      window.location.href = "/login";
    }
    throw new Error(result.detail || "Failed to update task status");
  }

  return result; // Returns updated task
}