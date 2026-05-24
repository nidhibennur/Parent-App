import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords don't match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register(email.trim(), password);
      setSuccess(true);
      setTimeout(() => navigate("/", { replace: true }), 1800);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="login-success-overlay">
        <div className="login-success-card">
          <div className="login-success-logo">
            <img src="/logo.png" alt="ParentApp" />
          </div>
          <div className="login-success-check">✓</div>
          <h2 className="login-success-title">Account created!</h2>
          <p className="login-success-sub">Setting up your space…</p>
          <div className="login-success-dots">
            <span /><span /><span />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-split">
      {/* Left — branding panel */}
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <div className="auth-brand-logo">
            <img src="/logo.png" alt="ParentApp" className="auth-brand-logo-img" />
          </div>
          <h1 className="auth-brand-name">Parent App</h1>
          <p className="auth-brand-tagline">
            Join thousands of parents finding<br />
            calm in the everyday chaos.
          </p>
          <ul className="auth-brand-features">
            <li><span className="auth-feature-dot" />Takes 2 minutes to set up</li>
            <li><span className="auth-feature-dot" />Personalised to your children&apos;s ages</li>
            <li><span className="auth-feature-dot" />Free to use, always</li>
          </ul>
        </div>
        <div className="auth-brand-deco">🌱</div>
      </div>

      {/* Right — form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <div className="auth-mobile-logo">
            <img src="/logo.png" alt="ParentApp" className="auth-mobile-logo-img" />
            <span>Parent App</span>
          </div>

          <h2 className="auth-form-title">Create your account</h2>
          <p className="auth-form-sub">Your personalised parenting companion awaits</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="confirm">Confirm password</label>
              <input
                id="confirm"
                type="password"
                placeholder="Repeat your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
