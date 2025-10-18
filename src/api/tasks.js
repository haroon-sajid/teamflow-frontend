
// src/api/tasks.js
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

/* --------------------  GET ALL TASKS (Organization-scoped)  -------------------- */
export async function getTasks() {
  const organizationId = getOrganizationId();
  
  const res = await fetch(`${API_URL}/tasks/?organization_id=${organizationId}`, {
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
    throw new Error(result.detail || "Failed to load tasks");
  }
  return result;
}

/* --------------------  GET SINGLE TASK  -------------------- */
export async function getTask(id) {
  const organizationId = getOrganizationId();
  const cleanId = String(id).trim();                    // ← NEW: trim id
  
  const res = await fetch(`${API_URL}/tasks/${cleanId}?organization_id=${organizationId}`, {
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
    throw new Error(result.detail || "Failed to load task");
  }
  return result;
}

/* --------------------  CREATE TASK  -------------------- */
export async function createTask(data) {
  const organizationId = getOrganizationId();

  // Handle due_date formatting
  let due = data.due_date;
  if (due && typeof due === 'string' && !due.includes('T')) {
    due = `${due}T00:00:00`;
  }

  const taskData = {
    ...data,
    due_date: due,
    organization_id: organizationId,
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

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('organizationId');
      window.location.href = '/login';
    }
    throw new Error(errorMessage);
  }
  return result;
}


/* --------------------  UPDATE TASK  -------------------- */
export async function updateTask(id, data) {
  if (!id && id !== 0) {
    throw new Error("updateTask: missing task id");
  }
  const taskId = String(id).trim();
  if (!taskId) throw new Error("updateTask: invalid task id");

  // Format due_date if provided
  let due = data?.due_date;
  if (due && typeof due === "string" && !due.includes("T")) {
    due = `${due}T00:00:00Z`;
  }

  // Build body with only allowed keys (safer)
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

  console.debug("[updateTask] PUT", `${API_URL}/tasks/${taskId}`, body);

  const res = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  // try parse JSON; handle empty body gracefully
  const text = await res.text().catch(() => "");
  let result;
  try { result = text ? JSON.parse(text) : null; } catch { result = text; }

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

    // Only force logout on 401 (invalid token). Do NOT log out on 403.
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("organizationId");
      window.location.href = "/login";
    }

    console.error("[updateTask] failed", res.status, msg, "response:", result);
    throw new Error(msg);
  }

  console.debug("[updateTask] success", result);
  return result;
}



/* --------------------  DELETE TASK  -------------------- */
export async function deleteTask(id) {
  const cleanId = String(id).trim();                    // ← NEW: trim id
  const res = await fetch(`${API_URL}/tasks/${cleanId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!res.ok) {
    const result = await res.json();
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('organizationId');
      window.location.href = '/login';
    }
    throw new Error(result.detail || 'Delete failed');
  }
  return true;
}


/* --------------------  UPDATE STATUS + COMMENTS + WORKLOGS (MEMBER SAFE)  -------------------- */
export async function updateTaskStatusAndLogs(id, data) {
  const organizationId = getOrganizationId();
  const cleanId = String(id).trim();                    // ← NEW: trim id

  const payload = {
    status: data.status,
    comments: data.comments || [],
    worklogs: data.worklogs || [],
    organization_id: organizationId,
  };

  const res = await fetch(`${API_URL}/tasks/${cleanId}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (!res.ok) {
    let errorMessage = 'Task update failed';
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
}



// /* --------------------  UPDATE TASK STATUS (MEMBER-SAFE)  -------------------- */
export async function updateTaskStatusOnly(id, status) {
  const cleanId = String(id).trim();
  const res = await fetch(`${API_URL}/tasks/${cleanId}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
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
}