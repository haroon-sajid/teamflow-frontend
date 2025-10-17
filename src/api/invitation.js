// src/api/invitation.js
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

/**
 * Send an invitation email to a new user.
 * Only admins can call this.
 */
export async function sendInvitation(data) {
  const organizationId = getOrganizationId();
  
  // Include organization_id in invitation data for multi-tenant context
  const invitationData = {
    ...data,
    organization_id: organizationId
  };

  const res = await fetch(`${API_URL}/auth/invitations`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(invitationData),
  });

  const result = await res.json();

  if (!res.ok) {
    const msg = result.detail || result.message || "Failed to send invitation";
    throw new Error(msg);
  }

  return result;
}

/**
 * Validate an invitation token before showing the registration form.
 * Used in /accept-invitation page.
 */
export async function validateInvitation(token) {
  const res = await fetch(`${API_URL}/auth/invitations/validate/${token}`);
  const result = await res.json();

  if (!res.ok) {
    const msg = result.detail || result.message || "Invalid or expired invitation token";
    throw new Error(msg);
  }

  return result;
}

/**
 * Accept an invitation and register the user.
 * Called when user submits the form after clicking invitation link.
 */
export async function acceptInvitation(data) {
  const res = await fetch(`${API_URL}/auth/invitations/accept`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    const msg = result.detail || result.message || "Failed to accept invitation";
    throw new Error(msg);
  }

  // Store user data after successful invitation acceptance
  if (result.user) {
    localStorage.setItem("user", JSON.stringify(result.user));
    if (result.user.organization_id) {
      localStorage.setItem("organizationId", result.user.organization_id.toString());
    }
  }

  return result;
}

/**
 * Get all invitations sent by the current admin (including accepted ones).
 * Organization-scoped to only show invitations from user's organization.
 */
export async function getMyInvitations() {
  const organizationId = getOrganizationId();
  
  const res = await fetch(`${API_URL}/auth/my-invitations?organization_id=${organizationId}`, {
    headers: authHeaders(),
  });

  const result = await res.json();

  if (!res.ok) {
    const msg = result.detail || result.message || "Failed to fetch invitations";
    throw new Error(msg);
  }

  return result;
}

/**
 * Resend an invitation to a user by email.
 * Only admins can call this.
 */
export async function resendInvitation(email) {
  const organizationId = getOrganizationId();
  
  const res = await fetch(`${API_URL}/auth/invitations/resend/${email}?organization_id=${organizationId}`, {
    method: "POST",
    headers: authHeaders(),
  });

  const result = await res.json();
  if (!res.ok) {
    const msg = result.detail || result.message || "Failed to resend invitation";
    throw new Error(msg);
  }

  return result;
}

/**
 * Revoke an invitation by invitation ID.
 * Only admins can call this.
 */
export async function revokeInvitation(invitationId) { // Changed parameter name
  const organizationId = getOrganizationId();
  
  const res = await fetch(`${API_URL}/auth/invitations/${invitationId}?organization_id=${organizationId}`, { // Changed path
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const result = await res.json();
    const msg = result.detail || result.message || "Failed to revoke invitation";
    throw new Error(msg);
  }

  return true;
}

/**
 * Get invitation statistics for the current organization.
 * Only admins can call this.
 */
export async function getInvitationStats() {
  const organizationId = getOrganizationId();
  
  const res = await fetch(`${API_URL}/auth/invitations/stats?organization_id=${organizationId}`, {
    headers: authHeaders(),
  });

  const result = await res.json();
  if (!res.ok) {
    const msg = result.detail || result.message || "Failed to fetch invitation stats";
    throw new Error(msg);
  }

  return result;
}

/**
 * Bulk send invitations to multiple users.
 * Only admins can call this.
 */
export async function bulkSendInvitations(emails, role = "member") {
  const organizationId = getOrganizationId();
  
  const invitationData = {
    emails: emails,
    role: role,
    organization_id: organizationId
  };

  const res = await fetch(`${API_URL}/auth/invitations/bulk`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(invitationData),
  });

  const result = await res.json();
  if (!res.ok) {
    const msg = result.detail || result.message || "Failed to send bulk invitations";
    throw new Error(msg);
  }

  return result;
}


 // src/api/invitation.js
export const getOrganizationMembers = async () => {
  const orgId = localStorage.getItem("organization_id");
  if (!orgId) {
    console.warn("No organization ID found in localStorage");
    return [];
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/organizations/${orgId}/members`, {
    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
  });

  if (!res.ok) throw new Error("Failed to fetch organization members");
  return await res.json();
};



 /* -------------------------------------------------- */
 /* Re-export aliases so both names work everywhere    */
 /* -------------------------------------------------- */
 export { validateInvitation as validateInvitationToken };