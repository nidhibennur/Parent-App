import { useState } from "react";
import { TIPS, AGE_GROUPS } from "../../data/tips";
import { useAuth } from "../../context/AuthContext";

const todayTip = TIPS[new Date().getDay() % TIPS.length];

export default function DailyTips() {
  const { profile } = useAuth();
  const [activeGroup, setActiveGroup] = useState("all");
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem("saved-tips") || "[]"); }
    catch { return []; }
  });
  const [aiTips, setAiTips] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);

  const filtered = activeGroup === "all"
    ? TIPS
    : TIPS.filter((t) => t.age === activeGroup || t.age === "all");

  function toggleSave(id) {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("saved-tips", JSON.stringify(next));
      return next;
    });
  }

  async function fetchAiTips() {
    setAiLoading(true);
    setAiError(false);
    setAiTips([]);
    try {
      const res = await fetch("http://localhost:4000/api/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age_group: activeGroup, profile }),
      });
      const data = await res.json();
      setAiTips(data.tips ?? []);
    } catch {
      setAiError(true);
    } finally {
      setAiLoading(false);
    }
  }

  const ageLabel = AGE_GROUPS.find((g) => g.id === activeGroup)?.label ?? "All Ages";

  return (
    <main className="page-content tips-page">
      <div className="section-tag">Daily Tips</div>
      <h1 className="section-title">Parenting tips that help</h1>
      <p className="section-sub">
        Practical, research-backed ideas — or generate fresh AI tips for your child&apos;s age group.
      </p>

      {/* Tip of the day */}
      <section className="tip-of-day">
        <span className="tip-of-day-badge">Tip of the day</span>
        <div className="tip-of-day-body">
          <span className="tip-emoji">{todayTip.emoji}</span>
          <div>
            <h3>{todayTip.title}</h3>
            <p>{todayTip.body}</p>
          </div>
        </div>
      </section>

      {/* Age filter */}
      <div className="tips-filter">
        {AGE_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            className={`filter-chip ${activeGroup === g.id ? "active" : ""}`}
            onClick={() => { setActiveGroup(g.id); setAiTips([]); setAiError(false); }}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* AI tips section */}
      <div className="ai-tips-bar">
        <p className="ai-tips-bar-text">
          Get AI-generated tips for <strong>{ageLabel}</strong>
        </p>
        <button
          type="button"
          className="btn-primary ai-tips-btn"
          onClick={fetchAiTips}
          disabled={aiLoading}
        >
          {aiLoading ? "Generating…" : "✨ Generate AI tips"}
        </button>
      </div>

      {aiError && (
        <p className="tips-error">Couldn&apos;t reach the server. Make sure the backend is running.</p>
      )}

      {aiTips.length > 0 && (
        <div className="ai-tips-section">
          <p className="ai-tips-label">✨ AI-generated for {ageLabel}</p>
          <div className="tips-grid">
            {aiTips.map((tip, i) => (
              <article key={i} className="tip-card tip-card-ai">
                <div className="tip-card-top">
                  <span className="tip-emoji">{tip.emoji}</span>
                </div>
                <h3>{tip.title}</h3>
                <p>{tip.body}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Static tips grid */}
      <p className="tips-section-label">Curated tips</p>
      <div className="tips-grid">
        {filtered.map((tip) => (
          <article key={tip.id} className="tip-card">
            <div className="tip-card-top">
              <span className="tip-emoji">{tip.emoji}</span>
              <button
                type="button"
                className={`tip-save-btn ${saved.includes(tip.id) ? "saved" : ""}`}
                onClick={() => toggleSave(tip.id)}
                aria-label={saved.includes(tip.id) ? "Unsave tip" : "Save tip"}
              >
                {saved.includes(tip.id) ? "♥" : "♡"}
              </button>
            </div>
            <h3>{tip.title}</h3>
            <p>{tip.body}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
