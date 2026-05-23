import { Link } from "react-router-dom";
import { QUICK_ACTIONS } from "../../data/quickActions";

const STEPS = [
  { n: 1, emoji: "🛡️", text: "Put your child in a safe place if needed." },
  { n: 2, emoji: "👃", text: "Breathe in slowly through your nose." },
  { n: 3, emoji: "💨", text: "Exhale longer than you inhaled." },
  { n: 4, emoji: "😮‍💨", text: "Unclench your jaw and drop your shoulders." },
  { n: 5, emoji: "💬", text: "Ask for AI help or use Calm Tools when ready." },
];

const RESOURCES = [
  { label: "Emergency services", number: "112", note: "Europe · immediate danger" },
  { label: "Crisis text line", number: "Text HOME to 741741", note: "Free, 24/7 support" },
  { label: "Parent helpline", number: "1-800-4-A-CHILD", note: "Parenting support" },
];

export default function Emergency() {
  return (
    <main className="emergency-page">

      {/* Hero */}
      <section className="emergency-hero">
        <div className="emergency-hero-text">
          <div className="emergency-badge">SOS</div>
          <h1>You&apos;re not alone</h1>
          <p>Take a breath. You don&apos;t have to figure this out alone right now.</p>
          <a href="tel:112" className="emergency-call-btn">
            📞 Call emergency services
          </a>
        </div>
        <div className="emergency-breathe">
          <div className="breathe-ring outer" />
          <div className="breathe-ring mid" />
          <div className="breathe-circle">
            <span className="breathe-in-label">breathe in</span>
            <span className="breathe-out-label">breathe out</span>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="emergency-steps-section">
        <p className="emergency-steps-heading">Ground yourself — one step at a time</p>
        <ol className="emergency-steps">
          {STEPS.map((s) => (
            <li key={s.n} className="emergency-step-card">
              <div className="emergency-step-top">
                <span className="emergency-step-num">{s.n}</span>
                <span className="emergency-step-emoji">{s.emoji}</span>
              </div>
              <span>{s.text}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Crisis resources */}
      <section className="emergency-resources-section">
        <p className="emergency-resources-heading">Crisis resources</p>
        <div className="emergency-resources">
          {RESOURCES.map((r) => (
            <div key={r.label} className="emergency-resource-card">
              <div className="emergency-resource-label">{r.label}</div>
              <div className="emergency-resource-number">{r.number}</div>
              <div className="emergency-resource-note">{r.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <section className="emergency-actions-section">
        <div className="emergency-actions">
          <Link to="/calm-tools" className="btn-primary">
            30-second reset →
          </Link>
          <Link
            to={`/?${new URLSearchParams({ prompt: QUICK_ACTIONS[1].prompt, topic: "overwhelmed" }).toString()}`}
            className="btn-secondary"
          >
            Talk to AI now
          </Link>
        </div>
        <p className="emergency-note">
          If anyone is in immediate physical danger, call emergency services first.
        </p>
      </section>
    </main>
  );
}
