// src/pages/AcceptInvitation.jsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { validateInvitationToken, acceptInvitation } from "../api/auth"; // or "../api/invitation"

export default function AcceptInvitation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // const token = searchParams.get("token");
  const token = searchParams.get("token");
  console.log("🔍 Raw token from URL:", token); // ADD THIS
  
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    full_name: "", 
    password: "" 
  });

  useEffect(() => {
    if (token) {
      validateToken();
    } else {
      toast.error("No invitation token provided");
      navigate("/login");
    }
  }, [token]);

  const validateToken = async () => {
    setValidating(true);
    try {
      const result = await validateInvitationToken(token);
      setInvitation(result);
      toast.success("Invitation validated successfully!");
    } catch (error) {
      console.error("Token validation error:", error);
      toast.error(error.message || "Invalid or expired invitation link");
      setTimeout(() => navigate("/login"), 2000);
    } finally {
      setValidating(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (!formData.full_name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    setLoading(true);

    try {
      const result = await acceptInvitation({
        token: token,
        full_name: formData.full_name.trim(),
        password: formData.password
      });

      if (result.access_token) {
        localStorage.setItem("token", result.access_token);
      }
      
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("userName", result.user.full_name || result.user.email.split('@')[0]);
        localStorage.setItem("userRole", result.user.role);
        
        if (result.user.organization_id) {
          localStorage.setItem("organizationId", result.user.organization_id);
        }
      }
      
      toast.success("Welcome to TeamFlow! 🎉");
      
      setTimeout(() => {
        if (result.user.role === "admin" || result.user.role === "super_admin") {
          navigate("/admin");
        } else {
          navigate("/member");
        }
      }, 1000);
      
    } catch (error) {
      console.error("Accept invitation error:", error);
      toast.error(error.message || "Failed to accept invitation");
    } finally {
      setLoading(false);
    }
  };

  // Validating State
  if (validating) {
    return (
      <div className="auth-card">
        <div className="status-icon loading">
          <div className="spinner"></div>
        </div>
        <h2 className="auth-title">Validating Invitation</h2>
        <p className="auth-subtitle">
          Please wait while we verify your invitation...
        </p>
      </div>
    );
  }

  // Invalid Invitation State
  if (!invitation) {
    return (
      <div className="auth-card">
        <div className="status-icon error">
          ❌
        </div>
        <h2 className="auth-title">Invalid Invitation</h2>
        <p className="auth-subtitle">
          The invitation link is invalid or has expired.
        </p>
        <button 
          className="auth-btn"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Main Form
  return (
    <div className="auth-card">
      {/* Brand Logo */}
      <div className="auth-brand">
        <div className="auth-logo">
          <span className="auth-logo-text">TF</span>
        </div>
      </div>

      {/* Success Icon */}
      <div className="status-icon success">
        ✓
      </div>

      {/* Title & Subtitle */}
      <h2 className="auth-title">Accept Invitation</h2>
      <p className="auth-subtitle">
        You've been invited to join as <strong>{invitation.role}</strong>
        <br />
        <span style={{color: '#94a3b8', fontSize: '0.875rem'}}>{invitation.email}</span>
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <label className="auth-label">
            <span className="auth-label-icon">👤</span>
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            required
            placeholder="Enter your full name"
            className="auth-input"
            disabled={loading}
          />
        </div>

        <div>
          <label className="auth-label">
            <span className="auth-label-icon">🔒</span>
            Password
          </label>
          <div className="pw-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              placeholder="Create a strong password"
              minLength={8}
              className="auth-input"
              disabled={loading}
            />
            <span 
              className="pw-eye" 
              onClick={() => setShowPassword(!showPassword)}
              role="button"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <svg className="pw-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="pw-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              )}
            </span>
          </div>
          <p className="helper-text">
            <span className="helper-text-icon">ℹ️</span>
            Password must be at least 8 characters
          </p>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="auth-btn"
        >
          {loading ? "Creating Account..." : "Create Account & Join Team"}
        </button>
      </form>

      {/* Footer */}
      <p className="auth-footer">
        Already have an account?{" "}
        <button
          onClick={() => navigate("/login")}
          type="button"
        >
          Login here
        </button>
      </p>
    </div>
  );
}