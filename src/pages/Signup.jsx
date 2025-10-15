// src/pages/Signup.jsx
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { signupUser } from "../api/auth";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const nav = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await signupUser(form);
      const access_token = data?.access_token ?? data?.token ?? null;
      const user = data?.user ?? data?.data ?? null;

      if (!user) {
        console.error("Signup error: server response missing user object", data);
        toast.error("Signup succeeded but client did not receive user data.");
        setLoading(false);
        return;
      }

      login({ access_token, user });

      if (access_token) localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userName", user.full_name ?? user.name ?? user.email.split("@")[0]);
      if (user.role) localStorage.setItem("userRole", user.role);
      if (user.organization_id) localStorage.setItem("organizationId", user.organization_id);

      toast.success("Organization created successfully! 🎉");

      if (user.role === "admin" || user.role === "super_admin") {
        nav("/admin");
      } else {
        nav("/member");
      }
    } catch (err) {
      console.error("Signup error:", err);
      const msg = err?.message || err?.detail || "Signup failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      {/* Brand Logo */}
      <div className="auth-brand">
        <div className="auth-logo">
          <span className="auth-logo-text">TF</span>
        </div>
      </div>

      <h2 className="auth-title">Create Your Organization</h2>
      <p className="auth-subtitle">Sign up as Admin to get started with TeamFlow</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <label className="auth-label">
            <span className="auth-label-icon">👤</span>
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
            className="auth-input"
          />
        </div>

        <div>
          <label className="auth-label">
            <span className="auth-label-icon">✉️</span>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@company.com"
            className="auth-input"
          />
        </div>

        <div>
          <label className="auth-label">
            <span className="auth-label-icon">🔒</span>
            Password
          </label>
          <div className="pw-wrapper">
            <input
              type={show ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Create a strong password"
              minLength={8}
              className="auth-input"
            />
            <span 
              className="pw-eye" 
              onClick={() => setShow((s) => !s)}
              role="button"
              aria-label="Toggle password visibility"
            >
              {show ? (
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
            Minimum 8 characters
          </p>
        </div>

        <button type="submit" disabled={loading} className="auth-btn">
          {loading ? "Creating Organization..." : "Create Organization"}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}