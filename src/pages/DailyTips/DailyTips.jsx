import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Bookmark, BookmarkCheck, Sparkles, RefreshCw } from "lucide-react";
import { TIPS, AGE_GROUPS } from "../../data/tips";
import { useAuth } from "../../context/AuthContext";

const TODAY_KEY = new Date().toISOString().slice(0, 10); // "2026-05-24"
const TODAY_LABEL = new Date().toLocaleDateString("en", {
  weekday: "long", month: "long", day: "numeric",
});

const AGE_EMOJI = {
  all: "🌍", baby: "👶", toddler: "🧒", prek: "🎨", school: "🏫",
};

function loadCachedTod(userKey) {
  const key = userKey ? `tip-of-day_${userKey}` : "tip-of-day";
  try {
    const cached = JSON.parse(localStorage.getItem(key) || "null");
    if (cached?.date === TODAY_KEY) return cached.tip;
  } catch { /* noop */ }
  return null;
}

export default function DailyTips() {
  const { profile, userKey } = useAuth();
  const [todTip, setTodTip] = useState(() => loadCachedTod(userKey));
  const [todLoading, setTodLoading] = useState(() => !loadCachedTod(userKey));
  const [activeGroup, setActiveGroup] = useState("all");
  const [showSaved, setShowSaved] = useState(false);
  const [saved, setSaved] = useState(() => {
    const key = userKey ? `saved-tips_${userKey}` : "saved-tips";
    try { return JSON.parse(localStorage.getItem(key) || "[]"); }
    catch { return []; }
  });
  const [aiTips, setAiTips] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);

  useEffect(() => {
    if (todTip) return;
    fetch("http://localhost:4000/api/tip-of-day", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile }),
    })
      .then((r) => r.json())
      .then((tip) => {
        setTodTip(tip);
        localStorage.setItem(userKey ? `tip-of-day_${userKey}` : "tip-of-day", JSON.stringify({ date: TODAY_KEY, tip }));
      })
      .catch(() => {
        // Fall back to a static tip if server is offline
        const fallback = TIPS[new Date().getDay() % TIPS.length];
        setTodTip(fallback);
      })
      .finally(() => setTodLoading(false));
  }, []);

  const baseFiltered = activeGroup === "all"
    ? TIPS
    : TIPS.filter((t) => t.age === activeGroup || t.age === "all");

  const filtered = showSaved
    ? baseFiltered.filter((t) => saved.includes(t.id))
    : baseFiltered;

  function toggleSave(id) {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(userKey ? `saved-tips_${userKey}` : "saved-tips", JSON.stringify(next));
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
  const savedCount = saved.length;

  return (
    <main className="page-content tips-page">
      <div className="section-tag">Daily Tips</div>
      <h1 className="section-title">Parenting tips that help</h1>
      <p className="section-sub">
        Practical, research-backed ideas — or generate fresh AI tips for your child&apos;s age group.
      </p>

      {/* Tip of the day */}
      <section className="tip-of-day">
        <div className="tip-of-day-meta">
          <span className="tip-of-day-badge">✦ Tip of the day</span>
          <span className="tip-of-day-date">{TODAY_LABEL}</span>
        </div>
        {todLoading ? (
          <div className="tip-of-day-body">
            <div className="tip-tod-skel-icon" />
            <div className="tip-tod-skel-text">
              <div className="tip-tod-skel-line tip-tod-skel-title" />
              <div className="tip-tod-skel-line" />
              <div className="tip-tod-skel-line tip-tod-skel-short" />
            </div>
          </div>
        ) : (
          <div className="tip-of-day-body">
            <div className="tip-of-day-emoji-wrap">
              <span>{todTip?.emoji}</span>
            </div>
            <div>
              <h3>{todTip?.title}</h3>
              <p>{todTip?.body}</p>
            </div>
          </div>
        )}
      </section>

      {/* Age filter + saved toggle */}
      <div className="tips-toolbar">
        <div className="tips-filter">
          {AGE_GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`filter-chip ${activeGroup === g.id && !showSaved ? "active" : ""}`}
              onClick={() => { setActiveGroup(g.id); setAiTips([]); setAiError(false); setShowSaved(false); }}
            >
              {AGE_EMOJI[g.id]} {g.label}
            </button>
          ))}
        </div>
        {savedCount > 0 && (
          <button
            type="button"
            className={`filter-chip tips-saved-chip ${showSaved ? "active" : ""}`}
            onClick={() => setShowSaved((v) => !v)}
          >
            <BookmarkCheck size={14} />
            Saved ({savedCount})
          </button>
        )}
      </div>

      {/* AI generate banner */}
      <div className="ai-tips-banner">
        <div className="ai-tips-banner-text">
          <Sparkles size={18} className="ai-tips-sparkle" />
          <div>
            <p className="ai-tips-banner-title">Generate AI tips for <strong>{ageLabel}</strong></p>
            <p className="ai-tips-banner-sub">Personalised to your child&apos;s stage, fresh every time</p>
          </div>
        </div>
        <button
          type="button"
          className="ai-tips-generate-btn"
          onClick={fetchAiTips}
          disabled={aiLoading}
        >
          {aiLoading
            ? <><RefreshCw size={15} className="ai-tips-spin" /> Generating…</>
            : <><Sparkles size={15} /> Generate</>}
        </button>
      </div>

      {aiError && (
        <div className="offline-banner">
          <span>⚠️ Couldn&apos;t reach the server.</span>
          <button type="button" className="offline-retry" onClick={fetchAiTips}>Retry</button>
        </div>
      )}

      {/* AI tips */}
      {aiTips.length > 0 && (
        <div className="ai-tips-section">
          <p className="ai-tips-label"><Sparkles size={13} /> AI-generated for {ageLabel}</p>
          <div className="tips-grid">
            {aiTips.map((tip, i) => (
              <article key={i} className="tip-card tip-card-ai">
                <div className="tip-card-top">
                  <div className="tip-emoji-bubble tip-emoji-bubble--ai">{tip.emoji}</div>
                </div>
                <h3>{tip.title}</h3>
                <div className="gpt-markdown tip-card-body"><ReactMarkdown>{tip.body}</ReactMarkdown></div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Curated tips */}
      <div className="tips-section-header">
        <p className="tips-section-label">{showSaved ? "Saved tips" : "Curated tips"}</p>
        {showSaved && filtered.length === 0 && (
          <p className="tips-empty">No saved tips in this category yet.</p>
        )}
      </div>
      <div className="tips-grid">
        {filtered.map((tip) => {
          const isSaved = saved.includes(tip.id);
          const ageInfo = AGE_GROUPS.find((g) => g.id === tip.age);
          return (
            <article key={tip.id} className="tip-card">
              <div className="tip-card-top">
                <div className="tip-emoji-bubble">{tip.emoji}</div>
                <div className="tip-card-meta">
                  {ageInfo && tip.age !== "all" && (
                    <span className="tip-age-badge">{AGE_EMOJI[tip.age]} {ageInfo.label}</span>
                  )}
                  <button
                    type="button"
                    className={`tip-save-btn ${isSaved ? "saved" : ""}`}
                    onClick={() => toggleSave(tip.id)}
                    aria-label={isSaved ? "Unsave tip" : "Save tip"}
                  >
                    {isSaved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
                  </button>
                </div>
              </div>
              <h3>{tip.title}</h3>
              <p className="tip-card-body">{tip.body}</p>
            </article>
          );
        })}
      </div>
    </main>
  );
}
