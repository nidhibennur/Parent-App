import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MILESTONE_GROUPS, AGE_RANGE_TO_GROUPS, AGE_EMOJIS, TYPE_COLORS } from "../../data/milestones";
import { fetchMilestones, saveMilestones } from "../../utils/milestoneApi";

function loadChecked() {
  try { return JSON.parse(localStorage.getItem("milestones-v2") || "{}"); }
  catch { return {}; }
}

function getGroup(id) {
  return MILESTONE_GROUPS.find((g) => g.id === id);
}

export default function Milestones() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const children = profile?.children?.filter((c) => c.nickname?.trim() && c.ageRange) ?? [];
  const hasChildren = children.length > 0;

  const [activeChildIdx, setActiveChildIdx] = useState(0);
  const [activeSubGroup, setActiveSubGroup] = useState({});
  const [activeType, setActiveType] = useState("all");
  const [checked, setChecked] = useState(loadChecked);

  // Sync from MongoDB on mount (fall back to localStorage already loaded above)
  useEffect(() => {
    fetchMilestones().then((data) => {
      if (data && Object.keys(data.checked).length > 0) {
        setChecked(data.checked);
        localStorage.setItem("milestones-v2", JSON.stringify(data.checked));
      }
    });
  }, []);
  const [fallbackGroup, setFallbackGroup] = useState(MILESTONE_GROUPS[0].id);

  const activeChild = children[activeChildIdx];
  const groupIds = hasChildren
    ? (AGE_RANGE_TO_GROUPS[activeChild?.ageRange] ?? [MILESTONE_GROUPS[0].id])
    : [fallbackGroup];

  const currentGroupId = activeSubGroup[activeChildIdx] ?? groupIds[0];
  const group = getGroup(currentGroupId) ?? MILESTONE_GROUPS[0];

  const childSlug = activeChild?.nickname?.toLowerCase().replace(/\s+/g, "-") ?? "child";
  const keyPrefix = hasChildren ? `${childSlug}-` : "g-";
  const filtered = activeType === "all"
    ? group.milestones
    : group.milestones.filter((m) => m.type === activeType);

  const doneCount = group.milestones.filter((m) => checked[`${keyPrefix}${m.id}`]).length;
  const progress = Math.round((doneCount / group.milestones.length) * 100);
  const types = ["all", ...new Set(group.milestones.map((m) => m.type))];

  function toggle(id) {
    const key = `${keyPrefix}${id}`;
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem("milestones-v2", JSON.stringify(next));
      saveMilestones(next);
      return next;
    });
  }

  function switchChild(idx) {
    setActiveChildIdx(idx);
    setActiveType("all");
  }

  function switchSubGroup(idx, groupId) {
    setActiveSubGroup((prev) => ({ ...prev, [idx]: groupId }));
    setActiveType("all");
  }

  function askAI() {
    const child = hasChildren ? activeChild : null;
    const ageLabel = group.label;
    const pending = group.milestones.filter((m) => !checked[`${keyPrefix}${m.id}`]);
    const pendingList = pending.slice(0, 5).map((m) => `• ${m.text}`).join("\n");
    const prompt = child
      ? `I'm tracking developmental milestones for my child ${child.nickname} (age range: ${ageLabel}). They haven't reached these milestones yet:\n${pendingList}\n\nCan you give me some tips and activities to help them develop in these areas?`
      : `I'm looking at developmental milestones for the ${ageLabel} age group. These milestones haven't been reached yet:\n${pendingList}\n\nCan you give me some tips and activities to help a child develop in these areas?`;
    const topic = child ? `milestone-${child.nickname}` : `milestone-${ageLabel}`;
    navigate(`/?prompt=${encodeURIComponent(prompt)}&topic=${encodeURIComponent(topic)}`);
  }

  return (
    <main className="page-content milestones-page">

      {/* Header */}
      <div className="section-tag">Milestone Tracker</div>
      {hasChildren ? (
        <>
          <h1 className="section-title">
            {activeChild.nickname}&apos;s milestones
          </h1>
          <p className="section-sub">
            Personalised to {activeChild.nickname}&apos;s age — check off milestones as they reach them.
          </p>
        </>
      ) : (
        <>
          <h1 className="section-title">Track your child&apos;s development</h1>
          <p className="section-sub">
            <Link to="/profile" className="milestone-profile-link">Add your children to your profile</Link>
            {" "}to get a personalised view. Browsing all age groups for now.
          </p>
        </>
      )}

      {/* Child selector — shown if profile has children */}
      {hasChildren && (
        <div className="milestone-child-tabs">
          {children.map((child, i) => (
            <button
              key={i}
              type="button"
              className={`milestone-child-tab ${i === activeChildIdx ? "active" : ""}`}
              onClick={() => switchChild(i)}
            >
              <span className="mct-emoji">{AGE_EMOJIS[child.ageRange] ?? "🧒"}</span>
              <div className="mct-info">
                <span className="mct-name">{child.nickname}</span>
                <span className="mct-age">{getGroup(AGE_RANGE_TO_GROUPS[child.ageRange]?.[0])?.label ?? child.ageRange}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Fallback age tabs — shown if no children in profile */}
      {!hasChildren && (
        <div className="milestone-tabs">
          {MILESTONE_GROUPS.map((g) => {
            const done = g.milestones.filter((m) => checked[`g-${m.id}`]).length;
            return (
              <button
                key={g.id}
                type="button"
                className={`milestone-tab ${fallbackGroup === g.id ? "active" : ""}`}
                onClick={() => { setFallbackGroup(g.id); setActiveType("all"); }}
              >
                {g.label}
                {done > 0 && <span className="milestone-tab-badge">{done}/{g.milestones.length}</span>}
              </button>
            );
          })}
        </div>
      )}

      {/* Sub-group tabs — when a child's age range spans two milestone groups (e.g. baby → 3-6m & 6-12m) */}
      {hasChildren && groupIds.length > 1 && (
        <div className="milestone-subgroup-tabs">
          {groupIds.map((gid) => (
            <button
              key={gid}
              type="button"
              className={`milestone-subgroup-tab ${currentGroupId === gid ? "active" : ""}`}
              onClick={() => switchSubGroup(activeChildIdx, gid)}
            >
              {getGroup(gid)?.label}
            </button>
          ))}
        </div>
      )}

      {/* Progress card */}
      <div className="milestone-progress-card">
        <div className="milestone-progress-top">
          <div>
            <div className="milestone-progress-pct">{progress}%</div>
            <div className="milestone-progress-label">
              {doneCount} of {group.milestones.length} milestones reached
            </div>
          </div>
          {progress === 100 && (
            <div className="milestone-complete-badge">🎉 All done!</div>
          )}
        </div>
        <div className="milestone-progress-bar">
          <div className="milestone-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Type filter */}
      <div className="milestone-type-filter">
        {types.map((t) => (
          <button
            key={t}
            type="button"
            className={`filter-chip ${activeType === t ? "active" : ""}`}
            onClick={() => setActiveType(t)}
          >
            {t === "all" ? "All" : t}
          </button>
        ))}
      </div>

      {/* Milestone list */}
      <div className="milestone-list">
        {filtered.map((m) => {
          const key = `${keyPrefix}${m.id}`;
          const done = !!checked[key];
          const colors = TYPE_COLORS[m.type];
          return (
            <button
              key={m.id}
              type="button"
              className={`milestone-item ${done ? "milestone-item--done" : ""}`}
              onClick={() => toggle(m.id)}
            >
              <span className={`milestone-check ${done ? "checked" : ""}`}>
                {done ? "✓" : ""}
              </span>
              <span className="milestone-text">{m.text}</span>
              <span className="milestone-type" style={{ background: colors.bg, color: colors.text }}>
                {m.type}
              </span>
            </button>
          );
        })}
      </div>

      <div className="milestone-ai-cta">
        <button type="button" className="milestone-ai-btn" onClick={askAI}>
          <span className="milestone-ai-icon">✦</span>
          {hasChildren
            ? `Ask AI about ${activeChild.nickname}'s development`
            : `Ask AI about ${group.label} development`}
        </button>
        <p className="milestone-ai-hint">
          Get personalised tips and activities for unchecked milestones
        </p>
      </div>

      <p className="milestone-disclaimer">
        Every child develops at their own pace. These are general guidelines — always consult your paediatrician if you have concerns.
      </p>
    </main>
  );
}
