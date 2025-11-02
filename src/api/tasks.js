// src/api/tasks.js - FIXED endpoints
import { API_URL } from "../config/apiConfig";

function authHeaders() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("⚠️ No token found in localStorage");
    throw new Error("No token found — please log in again");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/* --------------------  GET ALL TASKS  -------------------- */
export async function getTasks() {
  try {
    const res = await fetch(`${API_URL}/tasks/`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("organizationId");
        window.location.href = "/login";
        return [];
      }
      const result = await res.json();
      throw new Error(result.detail || "Failed to load tasks");
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("getTasks error:", error);
    throw error;
  }
}

/* --------------------  GET SINGLE TASK  -------------------- */
export async function getTask(id) {
  try {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      headers: authHeaders(),
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("organizationId");
        window.location.href = "/login";
      }
      const result = await res.json();
      throw new Error(result.detail || "Failed to load task");
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("getTask error:", error);
    throw error;
  }
}

/* --------------------  CREATE TASK  -------------------- */
export async function createTask(data) {
  try {
    const taskData = {
      ...data,
    };

    const res = await fetch(`${API_URL}/tasks/`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(taskData),
    });

    const result = await res.json();

    if (!res.ok) {
      let errorMessage = 'Create failed';
      if (typeof result === 'object') {
        if (Array.isArray(result.detail)) errorMessage = result.detail[0].msg;
        else if (result.detail) errorMessage = result.detail;
        else if (result.message) errorMessage = result.message;
        else errorMessage = Object.values(result).join(', ');
      } else {
        errorMessage = result;
      }

      if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('organizationId');
        window.location.href = '/login';
      }
      throw new Error(errorMessage);
    }
    return result;
  } catch (error) {
    console.error("createTask error:", error);
    throw error;
  }
}

/* --------------------  UPDATE TASK  -------------------- */
export async function updateTask(id, data) {
  try {
    if (!id && id !== 0) {
      throw new Error("updateTask: missing task id");
    }

    // Format due_date if provided
    let due = data?.due_date;
    if (due && typeof due === "string" && !due.includes("T")) {
      due = `${due}T00:00:00Z`;
    }

    // Build body with only allowed keys
    const allowedFields = [
      "title",
      "description",
      "status",
      "priority",
      "due_date",
      "project_id",
      "member_ids",
      "allow_member_edit",
    ];
    const body = {};
    for (const k of allowedFields) {
      if (k in data && data[k] !== undefined) body[k] = data[k];
    }
    if (body.due_date) body.due_date = due;

    console.log("🔄 Updating task:", { id, body });

    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let result;
    try { 
      result = text ? JSON.parse(text) : null; 
    } catch { 
      result = text; 
    }

    if (!res.ok) {
      let msg = "Update failed";
      if (result && typeof result === "object") {
        if (Array.isArray(result.detail)) msg = result.detail[0]?.msg || msg;
        else if (result.detail) msg = result.detail;
        else if (result.message) msg = result.message;
        else msg = Object.values(result).join(", ") || msg;
      } else if (result) {
        msg = String(result);
      }

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("organizationId");
        window.location.href = "/login";
      }

      throw new Error(msg);
    }

    return result;
  } catch (error) {
    console.error("updateTask error:", error);
    throw error;
  }
}

/* --------------------  DELETE TASK  -------------------- */
export async function deleteTask(id) {
  try {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });

    if (!res.ok) {
      const result = await res.json();
      if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('organizationId');
        window.location.href = '/login';
      }
      throw new Error(result.detail || 'Delete failed');
    }
    return true;
  } catch (error) {
    console.error("deleteTask error:", error);
    throw error;
  }
}

/* --------------------  UPDATE TASK STATUS ONLY  -------------------- */
export async function updateTaskStatusOnly(id, status) {
  try {
    const res = await fetch(`${API_URL}/tasks/${id}/status?status=${encodeURIComponent(status)}`, {
      method: 'PATCH',
      headers: authHeaders(),
    });

    if (!res.ok) {
      const result = await res.json().catch(() => ({}));
      let msg = result.detail || result.message || "Status update failed";
      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("organizationId");
        window.location.href = "/login";
      }
      throw new Error(msg);
    }
    return res.json();
  } catch (error) {
    console.error("updateTaskStatusOnly error:", error);
    throw error;
  }
}

/* --------------------  ASSIGN MEMBERS TO TASK  -------------------- */
export async function assignMembersToTask(taskId, memberIds) {
  try {
    // ✅ FIXED: Use proper JSON body instead of query params
    const res = await fetch(`${API_URL}/tasks/${taskId}/assign`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ member_ids: memberIds }),
    });

    const result = await res.json();

    if (!res.ok) {
      let errorMessage = 'Member assignment failed';
      if (typeof result === 'object') {
        if (Array.isArray(result.detail)) errorMessage = result.detail[0].msg;
        else if (result.detail) errorMessage = result.detail;
        else if (result.message) errorMessage = result.message;
        else errorMessage = Object.values(result).join(', ');
      } else {
        errorMessage = result;
      }

      if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('organizationId');
        window.location.href = '/login';
      }

      throw new Error(errorMessage);
    }

    return result;
  } catch (error) {
    console.error("assignMembersToTask error:", error);
    throw error;
  }
}












// In src/api/tasks.js - REPLACE the existing searchTasks function with this:

/* --------------------  ADVANCED TASK SEARCH  -------------------- */
export async function searchTasks(filters = {}) {
  try {
    // Remove empty filters and convert dates
    const processedFilters = {};
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== '' && filters[key] != null) {
        // Convert date fields to ISO strings
        if (key === 'fromDate' || key === 'toDate') {
          if (filters[key]) {
            processedFilters[key] = new Date(filters[key]).toISOString();
          }
        } else {
          processedFilters[key] = filters[key];
        }
      }
    });

    console.log('🔍 Searching tasks with filters:', processedFilters);

    const res = await fetch(`${API_URL}/tasks/search`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(processedFilters),
    });

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('organizationId');
        window.location.href = '/login';
        return [];
      }
      const result = await res.json();
      throw new Error(result.detail || 'Search failed');
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('searchTasks error:', error);
    throw error;
  }
}