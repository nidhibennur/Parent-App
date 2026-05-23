import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="hero-wrap">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="hero">
        <div>
          <div className="hero-badge">AI-Powered Parenting Support</div>
          <h1>
            You don&apos;t have to face <em>the hard moments</em> alone
          </h1>
          <p className="hero-desc">
            PARENT-APP combines AI-driven guidance, emotional regulation tools, and
            educational resources — so you can respond calmly when your child needs you
            most.
          </p>
          <div className="hero-actions">
            <Link to="/" className="btn-primary">
              Open the app →
            </Link>
            <a href="#how-it-works" className="btn-secondary">
              ▶ See how it works
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <span className="stat-num">24/7</span>
              <span className="stat-label">AI Support</span>
            </div>
            <div>
              <span className="stat-num">50+</span>
              <span className="stat-label">Resources</span>
            </div>
            <div>
              <span className="stat-num">100%</span>
              <span className="stat-label">Personalized</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-phone">
            <div className="phone-header">
              <div className="phone-header-top">
                <span className="phone-app-name">🌿 parentapp</span>
                <span className="phone-status">● Online</span>
              </div>
              <div className="phone-greeting">
                Good evening, Sarah 👋
                <br />
                <span>How are you and little one doing?</span>
              </div>
            </div>
            <div className="phone-body">
              <div className="chat-bubble bubble-ai">
                My toddler has been crying for 40 minutes and I don&apos;t know what to
                do anymore 😭
              </div>
              <div className="chat-bubble bubble-user">
                Take a slow breath — you&apos;re doing great. Let&apos;s try the 5-4-3-2-1
                grounding exercise together first...
              </div>
              <div className="chat-typing">
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </div>
            </div>
            <div className="phone-input-bar">
              <input
                className="phone-input"
                placeholder="Describe what's happening…"
                readOnly
              />
              <div className="phone-send">→</div>
            </div>
          </div>

          <div className="float-card float-card-1">
            <div style={{ fontSize: "1.4rem" }}>🧘</div>
            <div>
              <strong style={{ display: "block", color: "var(--ink)" }}>Calm Mode Active</strong>
              <span style={{ color: "var(--muted)", fontSize: "0.72rem" }}>
                Breathing exercise ready
              </span>
            </div>
          </div>
          <div className="float-card float-card-2">
            <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: 6 }}>
              Your mood today
            </div>
            <div className="mood-dots">
              <div className="mood-dot" style={{ background: "#fde8d0" }}>
                😤
              </div>
              <div className="mood-dot" style={{ background: "#d4e9d9" }}>
                😌
              </div>
              <div className="mood-dot" style={{ background: "#dceefa" }}>
                😊
              </div>
            </div>
          </div>
          <div className="float-card float-card-3">
            <div style={{ fontSize: "0.68rem", color: "var(--muted)", textTransform: "uppercase" }}>
              Streak
            </div>
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "var(--sage)",
                fontFamily: '"DM Serif Display", serif',
              }}
            >
              7 days 🔥
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
