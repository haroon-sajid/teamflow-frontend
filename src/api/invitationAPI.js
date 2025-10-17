// src/api/invitationAPI.js
import { 
  sendInvitation, 
  validateInvitation as validateInvitationToken, 
  acceptInvitation, 
  getMyInvitations, 
  resendInvitation,
  revokeInvitation 
} from './invitation';

export const invitationAPI = {
  sendInvitation,
  validateInvitationToken,
  acceptInvitation,
  getMyInvitations,
  resendInvitation,
  revokeInvitation,
  cancelInvitation: revokeInvitation // Alias for consistency
};






// src/api/invitationAPI.js  (or add to existing invitationAPI file)
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

export async function removeMemberFromOrganization(userId) {
  const res = await fetch(`${API_URL}/auth/members/${userId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    if (res.status === 401 || res.status === 403) {
      // preserve your existing auth handling
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("organizationId");
      window.location.href = "/login";
    }
    throw new Error(result.detail || result.message || "Failed to remove member");
  }

  return true;
}