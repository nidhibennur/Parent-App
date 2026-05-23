import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
            You don&apos;t have to have it all figured out.<br />
            We&apos;re here for the moments that matter most.
          </p>
          <ul className="auth-brand-features">
            <li><span className="auth-feature-dot" />AI guidance personalised to your family</li>
            <li><span className="auth-feature-dot" />Calm tools for stressful moments</li>
            <li><span className="auth-feature-dot" />Tips, milestones & mood check-ins</li>
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

          <h2 className="auth-form-title">Welcome back</h2>
          <p className="auth-form-sub">Sign in to continue your parenting journey</p>

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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="auth-switch">
            Don&apos;t have an account?{" "}
            <Link to="/register">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
