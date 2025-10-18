// src/pages/InviteMembers.jsx
import toast from "react-hot-toast";
import { useState, useContext, useEffect } from "react";
import Layout from "../components/Layout";
import InviteMemberModal from "../components/modals/InviteMemberModal"; 
import ConfirmationModal from "../components/modals/ConfirmationModal"; // Add this import
import { invitationAPI } from "../api/invitationAPI";
import { AuthContext } from "../context/AuthContext";

export default function InviteMembers() {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); // Add confirmation modal state
  const [confirmationConfig, setConfirmationConfig] = useState({ // Add confirmation config state
    title: "",
    message: "",
    onConfirm: () => {}
  });
  const [invitations, setInvitations] = useState([]);
  const [loadingInvitations, setLoadingInvitations] = useState(true);
  const [resendingInvitation, setResendingInvitation] = useState(null);
  const [revokingInvitation, setRevokingInvitation] = useState(null);
  

  // Load sent invitations
  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      setLoadingInvitations(true);
      const data = await invitationAPI.getMyInvitations();
      setInvitations(data);
    } catch (err) {
      console.error("Failed to load invitations:", err);
      toast.error("Failed to load invitations");
    } finally {
      setLoadingInvitations(false);
    }
  };

  const handleInvitationSent = (result) => {
    loadInvitations();
    setShowModal(false);
  };

  // Add confirmation handlers
  const handleResendInvitation = async (email) => {
    setConfirmationConfig({
      title: "Resend Invitation",
      message: `Are you sure you want to resend the invitation to ${email}?`,
      onConfirm: async () => {
        try {
          setResendingInvitation(email);
          await invitationAPI.resendInvitation(email);
          toast.success("Invitation resent successfully!");
          loadInvitations();
        } catch (error) {
          console.error("Failed to resend invitation:", error);
          toast.error(error.message || "Failed to resend invitation");
        } finally {
          setResendingInvitation(null);
        }
      }
    });
    setShowConfirmation(true);
  };

  const handleRevokeInvitation = async (invitationId, email) => {
    setConfirmationConfig({
      title: "Revoke Invitation",
      message: `Are you sure you want to revoke the invitation for ${email}? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          setRevokingInvitation(invitationId);
          await invitationAPI.revokeInvitation(invitationId);
          toast.success("Invitation revoked successfully!");
          loadInvitations();
        } catch (error) {
          console.error("Failed to revoke invitation:", error);
          toast.error(error.message || "Failed to revoke invitation");
        } finally {
          setRevokingInvitation(null);
        }
      }
    });
    setShowConfirmation(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'accepted': return 'status-badge accepted';
      case 'pending': return 'status-badge pending';
      default: return 'status-badge';
    }
  };

  const getRoleClass = (role) => {
    switch (role) {
      case 'admin': return 'role-badge admin';
      case 'member': return 'role-badge member';
      default: return 'role-badge';
    }
  };

  return (
    <Layout>
      <div className="invite-members-page">
        <div className="page-header">
          <h1>Invite Members</h1>
          <p className="subtitle">Send invitations to team members to join your workspace</p>
        </div>

        <InviteMemberModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleInvitationSent}
        />

        {/* Add Confirmation Modal */}
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={confirmationConfig.onConfirm}
          title={confirmationConfig.title}
          message={confirmationConfig.message}
          confirmText="Yes, Proceed"
          cancelText="Cancel"
        />

        <section className="card">
          <div className="card-header">
            <h2>Team Invitations</h2>
            <button 
              className="primary-btn add-btn" 
              onClick={() => setShowModal(true)}
            >
              + Send Invite
            </button>
          </div>

          <div className="table-wrapper">
            {loadingInvitations ? (
              <p className="loading">Loading invitations...</p>
            ) : invitations.length === 0 ? (
              <p className="empty">No invitations sent yet. Use the button above to send your first invitation.</p>
            ) : (
              <table className="project-table">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Expires At</th>
                    <th>Sent At</th>
                    <th>Accepted At</th>
                    <th className="action-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invitations.map((invitation, idx) => (
                    <tr key={invitation.id}>
                      <td>{idx + 1}</td>
                      <td>{invitation.email}</td>
                      <td>
                        <span className={getRoleClass(invitation.role)}>
                          {invitation.role}
                        </span>
                      </td>
                      <td>
                        <span className={getStatusClass(invitation.status)}>
                          {invitation.status}
                        </span>
                      </td>
                      <td>{formatDate(invitation.expires_at)}</td>
                      <td>{formatDate(invitation.created_at)}</td>
                      <td>{formatDate(invitation.accepted_at) || "N/A"}</td>
                      <td className="action-col">
                        <div className="invitation-actions">
                          {invitation.status === 'pending' ? (
                            <>
                              <button
                                className="invitation-action-btn invitation-resend-btn"
                                onClick={() => handleResendInvitation(invitation.email)}
                                disabled={resendingInvitation === invitation.email}
                              >
                                {resendingInvitation === invitation.email ? 'Resending...' : 'Resend'}
                              </button>
                              <button
                                className="invitation-action-btn invitation-revoke-btn"
                                onClick={() => handleRevokeInvitation(invitation.id, invitation.email)}
                                disabled={revokingInvitation === invitation.id}
                              >
                                {revokingInvitation === invitation.id ? 'Revoking...' : 'Revoke'}
                              </button>
                            </>
                          ) : (
                            <button
                              className="invitation-action-btn invitation-resend-btn"
                              onClick={() => handleResendInvitation(invitation.email, invitation.role)}
                            >
                              Send Again
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}

