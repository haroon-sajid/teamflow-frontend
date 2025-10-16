// src/api/taskExtras.js
// const API_URL = import.meta.env.VITE_API_URL?.trim() || "http://127.0.0.1:8000";
const API_URL = import.meta.env.VITE_API_URL?.trim() || "https://teamflow-backend-1tt9.onrender.com";

function authHeaders() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function handleUnauthorized(res) {
  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
  }
}

/* --------------------  TASK COMMENTS  -------------------- */
export async function fetchTaskComments(taskId) {
  try {
    const res = await fetch(`${API_URL}/tasks/${taskId}/comments`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      handleUnauthorized(res);
      const result = await res.json();
      return { ok: false, error: result.detail || "Failed to fetch comments" };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error.message || "Failed to fetch comments" };
  }
}

export async function postTaskComment(taskId, message) {
  try {
    const res = await fetch(`${API_URL}/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      handleUnauthorized(res);
      const result = await res.json();
      return { ok: false, error: result.detail || "Failed to post comment" };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error.message || "Failed to post comment" };
  }
}

/* --------------------  TASK WORK LOGS  -------------------- */
export async function fetchTaskWorkLogs(taskId) {
  try {
    const res = await fetch(`${API_URL}/tasks/${taskId}/worklogs`, {
      headers: authHeaders(),
    });

    if (!res.ok) {
      handleUnauthorized(res);
      const result = await res.json();
      return { ok: false, error: result.detail || "Failed to fetch work logs" };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error.message || "Failed to fetch work logs" };
  }
}

export async function postTaskWorkLog(taskId, logData) {
  try {
    const payload = {
      hours: parseFloat(logData.hours),
      description: logData.description || null,
      date: logData.date ? new Date(logData.date).toISOString() : null,
    };

    const res = await fetch(`${API_URL}/tasks/${taskId}/worklogs`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      handleUnauthorized(res);
      const result = await res.json();
      return { ok: false, error: result.detail || "Failed to log work" };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error.message || "Failed to log work" };
  }
}

/* --------------------  TASK PERMISSION TOGGLE  -------------------- */
export async function toggleTaskPermission(taskId, allowMemberEdit) {
  try {
    const res = await fetch(`${API_URL}/tasks/${taskId}/permission`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ allow_member_edit: allowMemberEdit }),
    });

    if (!res.ok) {
      handleUnauthorized(res);
      const result = await res.json();
      return { ok: false, error: result.detail || "Failed to update permission" };
    }

    const data = await res.json();
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error.message || "Failed to update permission" };
  }
}

