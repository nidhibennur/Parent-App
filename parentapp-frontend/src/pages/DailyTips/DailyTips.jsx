import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { TIPS, AGE_GROUPS } from "../../data/tips";
import { useAuth } from "../../context/AuthContext";

const TODAY_LABEL = new Date().toLocaleDateString("en", {
  weekday: "long", month: "long", day: "numeric",
});

const AGE_EMOJI = {
  all: "🌍", baby: "👶", toddler: "🧒", prek: "🎨", school: "🏫",
};

const TIP_OF_DAY = TIPS[new Date().getDate() % TIPS.length];

export default function DailyTips() {
  const { userKey } = useAuth();
  const [activeGroup, setActiveGroup] = useState("all");
  const [showSaved, setShowSaved] = useState(false);
  const [saved, setSaved] = useState(() => {
    const key = userKey ? `saved-tips_${userKey}` : "saved-tips";
    try { return JSON.parse(localStorage.getItem(key) || "[]"); }
    catch { return []; }
  });

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

  const savedCount = saved.length;

  return (
    <main className="page-content tips-page">
      <div className="section-tag">Daily Tips</div>
      <h1 className="section-title">Parenting tips that help</h1>
      <p className="section-sub">
        Practical, research-backed ideas for every stage of parenting.
      </p>

      {/* Tip of the day */}
      <section className="tip-of-day">
        <div className="tip-of-day-meta">
          <span className="tip-of-day-badge">✦ Tip of the day</span>
          <span className="tip-of-day-date">{TODAY_LABEL}</span>
        </div>
        <div className="tip-of-day-body">
          <div className="tip-of-day-emoji-wrap">
            <span>{TIP_OF_DAY.emoji}</span>
          </div>
          <div>
            <h3>{TIP_OF_DAY.title}</h3>
            <p>{TIP_OF_DAY.body}</p>
          </div>
        </div>
      </section>

      {/* Age filter + saved toggle */}
      <div className="tips-toolbar">
        <div className="tips-filter">
          {AGE_GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`filter-chip ${activeGroup === g.id && !showSaved ? "active" : ""}`}
              onClick={() => { setActiveGroup(g.id); setShowSaved(false); }}
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
