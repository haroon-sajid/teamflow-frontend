
// src/api/auth.js 
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

/* --------------------  SignUp  -------------------- */
export async function signupUser(data) {
  // ✅ Ensure correct data format for multi-tenant signup
  const signupData = {
    full_name: data.full_name || data.fullName, // Accept both naming conventions
    email: data.email,
    password: data.password,
    // Note: Your backend automatically creates organization, no need to send org data
  };

  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(signupData), // ✅ Send properly formatted data
  });

  const result = await res.json();

  if (!res.ok) {
    // Handle validation errors
    if (res.status === 422 && result.detail && Array.isArray(result.detail)) {
      throw new Error(result.detail[0].msg || "Validation error");
    }
    
    // Handle other errors with proper detail extraction
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

  // ✅ Store organization context after successful signup
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

  // ✅ Store user data and organization context
  if (result.user) {
    localStorage.setItem("user", JSON.stringify(result.user));
    // Store organization_id from user data for multi-tenant filtering
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

  // Handle 401/403 responses properly
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("organizationId");
    throw new Error("Authentication failed");
  }

  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Failed to get user data");
  
  // ✅ Update organization context
  if (result.organization_id) {
    localStorage.setItem("organizationId", result.organization_id.toString());
  }
  
  return result;
}

/* --------------------  Send Invitation  -------------------- */
export async function sendInvitation(data) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  // ✅ Include organization_id in invitation data for multi-tenant context
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
  const res = await fetch(`${API_URL}/auth/accept-invitation`, { // ✅ Fixed endpoint
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.detail || "Failed to accept invitation");
  
  // ✅ Store user data after successful invitation acceptance
  if (result.user) {
    localStorage.setItem("user", JSON.stringify(result.user));
    if (result.user.organization_id) {
      localStorage.setItem("organizationId", result.user.organization_id.toString());
    }
  }
  
  return result;
}

/* --------------------  Validate Invitation Token  -------------------- */
export async function validateInvitationToken(token) { // ✅ Fixed function name
  const res = await fetch(`${API_URL}/auth/invitations/validate/${token}`); // ✅ Fixed endpoint
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

  const res = await fetch(`${API_URL}/auth/my-invitations`, { // ✅ Fixed endpoint
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

  const res = await fetch(`${API_URL}/auth/invitations/resend/${email}`, { // ✅ Fixed endpoint
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
export function logoutUser() { // ✅ Fixed function name
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
export const validateInvitation = validateInvitationToken; // ✅ Fixed alias