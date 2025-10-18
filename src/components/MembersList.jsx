// src/components/TeamMembersList.jsx
import { useState, useEffect } from "react";
import { getUsers } from "../api/users.js";
import toast from "react-hot-toast";

export default function TeamMembersList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        
        // Check user role before fetching users
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.role === "admin" || user?.role === "super_admin") {
          const usersData = await getUsers();
          
          // Filter only members (not admins)
          const memberList = usersData.filter(
            user => user.role?.toLowerCase() === "member"
          );
          
          setMembers(memberList);
        } else {
          // Members don't fetch users list
          setMembers([]);
        }
      } catch (error) {
        console.error("Failed to load team members:", error);
        toast.error("Failed to load team members");
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div className="team-members-section">
        <h2>Team Members</h2>
        <p>Loading team members...</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="team-members-section">
        <h2>Team Members</h2>
        <p>No team members registered yet.</p>
      </div>
    );
  }

  return (
    <div className="team-members-section">
      <h2>Registered Members ({members.length})</h2>
      <div className="team-members-grid">
        {members.map((member) => (
          <div key={member.id} className="team-member-card">
            <div className="member-avatar">
              {member.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="member-info">
              <h4>{member.name}</h4>
              <p className="member-email">{member.email}</p>
              <p className="member-role">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}