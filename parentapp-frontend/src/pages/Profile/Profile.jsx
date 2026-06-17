import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const AGE_RANGE_LABELS = {
  newborn: "Newborn 0–3m", baby: "Baby 3–12m", toddler: "Toddler 1–3yr",
  preschool: "Preschool 3–5yr", school: "School-age 6–11yr", teen: "Teen 12+yr",
};

const ROLE_LABELS = {
  mom: "Mom", dad: "Dad", guardian: "Guardian", caregiver: "Caregiver", other: "Parent",
};

const ROLES = [
  { id: "mom", label: "Mom" }, { id: "dad", label: "Dad" },
  { id: "guardian", label: "Guardian" }, { id: "caregiver", label: "Caregiver" },
];

const AGE_RANGES = [
  { id: "newborn", label: "Newborn 0–3m" }, { id: "baby", label: "Baby 3–12m" },
  { id: "toddler", label: "Toddler 1–3yr" }, { id: "preschool", label: "Preschool 3–5yr" },
  { id: "school", label: "School-age 6–11yr" }, { id: "teen", label: "Teen 12+yr" },
];

const CHALLENGES = [
  "Sleep", "Tantrums & behavior", "Feeding & nutrition", "Screen time",
  "School & learning", "Emotional regulation", "Bonding & attachment",
  "Potty training", "Sibling rivalry", "Bedtime routines",
];

const STYLES = [
  { id: "brief", label: "Brief & direct", desc: "Short, to-the-point answers" },
  { id: "warm", label: "Warm & reassuring", desc: "Emotional support first, then advice" },
  { id: "detailed", label: "Detailed & thorough", desc: "Full explanations and background" },
  { id: "structured", label: "Step-by-step", desc: "Numbered steps and clear format" },
];

export default function Profile() {
  const { user, profile, logout, saveProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem("parentapp_prefs") || "{}").darkMode ?? false; }
    catch { return false; }
  });

  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editFirstTime, setEditFirstTime] = useState(null);
  const [editChildren, setEditChildren] = useState([]);
  const [editChallenges, setEditChallenges] = useState([]);
  const [editStyle, setEditStyle] = useState("");

  function openEdit() {
    setEditName(profile?.name ?? "");
    setEditRole(profile?.role ?? "");
    setEditFirstTime(profile?.firstTime ?? null);
    setEditChildren(profile?.children?.length ? [...profile.children] : [{ nickname: "", ageRange: "" }]);
    setEditChallenges(profile?.challenges ? [...profile.challenges] : []);
    setEditStyle(profile?.style ?? "");
    setIsEditing(true);
  }

  function updateChild(i, field, value) {
    setEditChildren((prev) => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c));
  }

  function addChild() { setEditChildren((prev) => [...prev, { nickname: "", ageRange: "" }]); }
  function removeChild(i) { setEditChildren((prev) => prev.filter((_, idx) => idx !== i)); }

  function toggleChallenge(c) {
    setEditChallenges((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveProfile({
        name: editName,
        role: editRole,
        firstTime: editFirstTime,
        children: editChildren.filter((c) => c.nickname.trim()),
        challenges: editChallenges,
        style: editStyle,
      });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function toggleDark(val) {
    setDarkMode(val);
    const prefs = JSON.parse(localStorage.getItem("parentapp_prefs") || "{}");
    localStorage.setItem("parentapp_prefs", JSON.stringify({ ...prefs, darkMode: val }));
    document.documentElement.classList.toggle("dark-mode", val);
  }

  if (isEditing) {
    return (
      <main className="profile-page">
        <div className="profile-edit-hero">
          <div className="profile-hero-avatar">{editName?.[0]?.toUpperCase() || "P"}</div>
          <div>
            <h1 className="profile-hero-name">Edit your profile</h1>
            <p className="profile-hero-sub">Changes update your AI responses immediately</p>
          </div>
        </div>

        <div className="profile-edit-body">
          <div className="profile-edit-section">
            <label className="profile-edit-label">Your name</label>
            <input
              type="text"
              className="ob-input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="First name"
            />
          </div>

          <div className="profile-edit-section">
            <label className="profile-edit-label">I am a…</label>
            <div className="ob-btn-group">
              {ROLES.map((r) => (
                <button key={r.id} type="button"
                  className={`ob-choice-btn ${editRole === r.id ? "ob-choice-btn--active" : ""}`}
                  onClick={() => setEditRole(r.id)}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="profile-edit-section">
            <label className="profile-edit-label">First-time parent?</label>
            <div className="ob-btn-group">
              <button type="button"
                className={`ob-choice-btn ${editFirstTime === true ? "ob-choice-btn--active" : ""}`}
                onClick={() => setEditFirstTime(true)}>
                Yes, first time
              </button>
              <button type="button"
                className={`ob-choice-btn ${editFirstTime === false ? "ob-choice-btn--active" : ""}`}
                onClick={() => setEditFirstTime(false)}>
                No, experienced
              </button>
            </div>
          </div>

          <div className="profile-edit-section">
            <label className="profile-edit-label">Your children</label>
            <div className="ob-children-list">
              {editChildren.map((child, i) => (
                <div key={i} className="ob-child-row">
                  <input type="text" className="ob-input ob-input--sm"
                    placeholder={`Child ${i + 1} nickname`}
                    value={child.nickname}
                    onChange={(e) => updateChild(i, "nickname", e.target.value)}
                  />
                  <select className="ob-select" value={child.ageRange}
                    onChange={(e) => updateChild(i, "ageRange", e.target.value)}>
                    <option value="">Age range…</option>
                    {AGE_RANGES.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
                  </select>
                  {editChildren.length > 1 && (
                    <button type="button" className="profile-remove-child" onClick={() => removeChild(i)}>✕</button>
                  )}
                </div>
              ))}
            </div>
            {editChildren.length < 6 && (
              <button type="button" className="btn-secondary profile-add-child-btn" onClick={addChild}>
                + Add child
              </button>
            )}
          </div>

          <div className="profile-edit-section">
            <label className="profile-edit-label">Focus areas</label>
            <div className="ob-chips">
              {CHALLENGES.map((c) => (
                <button key={c} type="button"
                  className={`ob-chip ${editChallenges.includes(c) ? "ob-chip--active" : ""}`}
                  onClick={() => toggleChallenge(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="profile-edit-section">
            <label className="profile-edit-label">Response style</label>
            <div className="ob-style-grid">
              {STYLES.map((s) => (
                <button key={s.id} type="button"
                  className={`ob-style-card ${editStyle === s.id ? "ob-style-card--active" : ""}`}
                  onClick={() => setEditStyle(s.id)}>
                  <strong>{s.label}</strong>
                  <span>{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="profile-edit-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
            <button type="button" className="btn-primary" onClick={handleSave}
              disabled={saving || !editName.trim()}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-hero-avatar">{profile?.name?.[0]?.toUpperCase() ?? "P"}</div>
        <div className="profile-hero-info">
          <h1 className="profile-hero-name">{profile?.name ?? "Your profile"}</h1>
          <p className="profile-hero-sub">
            {ROLE_LABELS[profile?.role] ?? "Parent"}
            {profile?.firstTime !== null && profile?.firstTime !== undefined &&
              ` · ${profile.firstTime ? "First-time parent" : "Experienced parent"}`
            }
          </p>
          <p className="profile-hero-email">{user?.email}</p>
        </div>
        <button type="button" className="profile-hero-edit-btn" onClick={openEdit}>
          Edit profile
        </button>
      </div>

      <div className="profile-body">
        {/* Children */}
        {profile?.children?.length > 0 && (
          <div className="profile-card">
            <h3 className="profile-card-title">Your children</h3>
            <div className="profile-children-grid">
              {profile.children.map((c, i) => (
                <div key={i} className="profile-child-card">
                  <div className="profile-child-emoji">👶</div>
                  <div>
                    <p className="profile-child-name">{c.nickname}</p>
                    <p className="profile-child-age">{AGE_RANGE_LABELS[c.ageRange] ?? c.ageRange}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Focus areas */}
        {profile?.challenges?.length > 0 && (
          <div className="profile-card">
            <h3 className="profile-card-title">Focus areas</h3>
            <div className="profile-tags">
              {profile.challenges.map((c) => (
                <span key={c} className="profile-tag">{c}</span>
              ))}
            </div>
          </div>
        )}

        {/* Response style */}
        {profile?.style && (
          <div className="profile-card">
            <h3 className="profile-card-title">Response style</h3>
            <div className="profile-style-display">
              <div className="profile-style-icon">💬</div>
              <div>
                <p className="profile-style-name">{STYLES.find((s) => s.id === profile.style)?.label}</p>
                <p className="profile-style-desc">{STYLES.find((s) => s.id === profile.style)?.desc}</p>
              </div>
            </div>
          </div>
        )}

        {/* Preferences */}
        <div className="profile-card profile-card--full">
          <h3 className="profile-card-title">Preferences</h3>
          <label className="profile-toggle-row">
            <div>
              <p className="profile-toggle-label">Dark mode</p>
              <p className="profile-toggle-hint">Easier on the eyes at night</p>
            </div>
            <div className={`profile-toggle-switch ${darkMode ? "on" : ""}`}
              onClick={() => toggleDark(!darkMode)}
              role="switch" aria-checked={darkMode} tabIndex={0}>
              <span className="profile-toggle-thumb" />
            </div>
          </label>
        </div>

        {/* Account */}
        <div className="profile-card profile-card--full">
          <h3 className="profile-card-title">Account</h3>
          <p className="profile-account-email">{user?.email}</p>
          <button type="button" className="profile-signout-btn" onClick={logout}>
            Sign out
          </button>
        </div>
      </div>
    </main>
  );
}
