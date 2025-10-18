
// src/api/auth.js 
// const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const API_URL = import.meta.env.VITE_API_URL?.trim() || "https://teamflow-backend-1tt9.onrender.com";


/* --------------------  SignUp  -------------------- */
export async function signupUser(data) {
  const signupData = {
    full_name: data.full_name || data.fullName,
    email: data.email,
    password: data.password,
  };

  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(signupData),
  });

  const result = await res.json();

  if (!res.ok) {
    if (res.status === 422 && result.detail && Array.isArray(result.detail)) {
      throw new Error(result.detail[0].msg || "Validation error");
    }
    
    let errorMessage = "Signup failed";
    if (typeof result === 'object') {
      if (result.detail) {
        errorMessage = Array.isArray(result.detail) 
          ? result.detail[0].msg 
          : result.detail;
      } else if (result.message) {
        errorMessage = result.message;
      } else {
        errorMessage = Object.values(result).join(', ');
      }
    } else {
      errorMessage = result;
    }
    
    throw new Error(errorMessage);
  }

  if (result.user && result.user.organization_id) {
    localStorage.setItem("organizationId", result.user.organization_id.toString());
  }

  return result;
}

/* --------------------  SignIn  -------------------- */
export async function loginUser(data) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    if (res.status === 422 && result.detail && Array.isArray(result.detail)) {
      throw new Error(result.detail[0].msg || "Validation error");
    }
    const errorDetail = result.detail || result.message || "Login failed";
    throw new Error(errorDetail);
  }

  if (result.user) {
    localStorage.setItem("user", JSON.stringify(result.user));
    if (result.user.organization_id) {
      localStorage.setItem("organizationId", result.user.organization_id.toString());
    }
  }

  return result;
}

/* --------------------  Get Current User  -------------------- */
export async function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401 || (res.status === 403 && result.detail?.includes("Invalid token"))) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("organizationId");
    throw new Error("Authentication failed");
  }

  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Failed to get user data");
  
  if (result.organization_id) {
    localStorage.setItem("organizationId", result.organization_id.toString());
  }
  
  return result;
}

/* --------------------  Send Invitation  -------------------- */
export async function sendInvitation(data) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const organizationId = localStorage.getItem("organizationId");
  const invitationData = {
    ...data,
    organization_id: organizationId ? parseInt(organizationId) : null
  };

  const res = await fetch(`${API_URL}/auth/invitations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(invitationData),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Failed to send invitation");
  return result;
}

/* --------------------  Accept Invitation  -------------------- */
export async function acceptInvitation(data) {
  const res = await fetch(`${API_URL}/auth/invitations/accept`, { // ✅ FIXED: Correct path
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Failed to accept invitation");
  
  if (result.user) {
    localStorage.setItem("user", JSON.stringify(result.user));
    if (result.user.organization_id) {
      localStorage.setItem("organizationId", result.user.organization_id.toString());
    }
  }
  
  return result;
}

/* --------------------  Validate Invitation Token  -------------------- */
export async function validateInvitationToken(token) {
  const res = await fetch(`${API_URL}/auth/invitations/validate/${token}`);
  const result = await res.json();

  if (!res.ok) {
    const msg = result.detail || result.message || "Invalid or expired invitation token";
    throw new Error(msg);
  }

  return result;
}

/* --------------------  Get My Invitations  -------------------- */
export async function getMyInvitations() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_URL}/auth/my-invitations`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Failed to fetch invitations");
  return result;
}

/* --------------------  Resend Invitation  -------------------- */
export async function resendInvitation(email) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_URL}/auth/invitations/resend/${email}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Failed to resend invitation");
  return result;
}

/* --------------------  Logout  -------------------- */
export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("organizationId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole");
  window.location.href = "/login";
}

// Export aliases for backwards compatibility
export const login = loginUser;
export const signup = signupUser;
export const logout = logoutUser;
export const validateInvitation = validateInvitationToken;