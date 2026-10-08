import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../lib/adminAuthService";
import "../styles/admin-login.css";

function normalizeRole(role) {
  return String(role || "").trim().toLowerCase();
}

/**
 * AdminLoginPage - Admin authentication page
 * Uses credentials stored in Firebase
 * Email: admin@123
 * Password: Cstu@123
 */
export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Attempt admin login
      const admin = await adminLogin(email, password);

      // Store admin info in localStorage
      localStorage.setItem("adminUser", JSON.stringify(admin));
      localStorage.setItem("adminUid", admin.uid);
      localStorage.setItem("cstuUser", JSON.stringify(admin));
      localStorage.setItem("cstuLoggedIn", "1");
      localStorage.setItem("cstuUserRole", normalizeRole(admin.role) || "admin");

      console.log("Admin login successful:", admin.name);

      // Redirect to admin dashboard
      navigate("/admin");
    } catch (err) {
      console.error("Login error:", err);

      // Provide user-friendly error message
      if (err.message === "Authentication failed. Please try again.") {
        setError("Authentication failed. Please try again.");
      } else if (err.message === "User is not an admin") {
        setError("This account does not have admin privileges.");
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Admin Login</h1>
            <p>Library Management System</p>
          </div>

          {error && <div className="error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@123"
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-button"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="login-footer">
            <p className="test-credentials">
              <strong>Test Credentials:</strong><br />
              Email: admin@123<br />
              Password: Cstu@123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
