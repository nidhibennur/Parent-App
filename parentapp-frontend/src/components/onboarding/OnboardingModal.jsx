import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const TOTAL_STEPS = 5;

const ROLES = [
  { id: "mom", label: "Mom" },
  { id: "dad", label: "Dad" },
  { id: "guardian", label: "Guardian" },
  { id: "caregiver", label: "Caregiver" },
];

const AGE_RANGES = [
  { id: "newborn", label: "Newborn 0–3m" },
  { id: "baby", label: "Baby 3–12m" },
  { id: "toddler", label: "Toddler 1–3yr" },
  { id: "preschool", label: "Preschool 3–5yr" },
  { id: "school", label: "School-age 6–11yr" },
  { id: "teen", label: "Teen 12+yr" },
];

const CHALLENGES = [
  "Sleep", "Tantrums & behavior", "Feeding & nutrition",
  "Screen time", "School & learning", "Emotional regulation",
  "Bonding & attachment", "Potty training", "Sibling rivalry", "Bedtime routines",
];

const STYLES = [
  { id: "brief", label: "Brief & direct", desc: "Short, to-the-point answers" },
  { id: "warm", label: "Warm & reassuring", desc: "Emotional support first, then advice" },
  { id: "detailed", label: "Detailed & thorough", desc: "Full explanations and background" },
  { id: "structured", label: "Step-by-step", desc: "Numbered steps and clear format" },
];

function StepDots({ step }) {
  return (
    <div className="ob-dots">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <span key={i} className={`ob-dot ${i < step ? "ob-dot--done" : ""} ${i === step - 1 ? "ob-dot--active" : ""}`} />
      ))}
    </div>
  );
}

export default function OnboardingModal() {
  const { saveProfile, user } = useAuth();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [firstTime, setFirstTime] = useState(null);
  const [childCount, setChildCount] = useState(1);
  const [children, setChildren] = useState([{ nickname: "", ageRange: "" }]);
  const [challenges, setChallenges] = useState([]);
  const [style, setStyle] = useState("");

  function updateChild(index, field, value) {
    setChildren((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  }

  function handleChildCount(count) {
    setChildCount(count);
    setChildren((prev) => {
      const next = [...prev];
      while (next.length < count) next.push({ nickname: "", ageRange: "" });
      return next.slice(0, count);
    });
  }

  function toggleChallenge(c) {
    setChallenges((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  function canProceed() {
    if (step === 1) return name.trim().length > 0 && role !== "";
    if (step === 2) return firstTime !== null;
    if (step === 3) return children.every((c) => c.nickname.trim() && c.ageRange);
    if (step === 4) return challenges.length > 0;
    if (step === 5) return style !== "";
    return true;
  }

  async function handleFinish() {
    setSaving(true);
    try {
      await saveProfile({ name, role, firstTime, children, challenges, style });
    } finally {
      setSaving(false);
    }
  }

  function next() {
    if (step < TOTAL_STEPS) setStep((s) => s + 1);
    else handleFinish();
  }

  function back() {
    if (step > 1) setStep((s) => s - 1);
  }

  return (
    <div className="ob-overlay">
      <div className="ob-modal">
        <StepDots step={step} />

        {step === 1 && (
          <div className="ob-step">
            <div className="ob-icon">👋</div>
            <h2 className="ob-title">Welcome to Parent App!</h2>
            <p className="ob-sub">Let&apos;s personalise your experience so the AI gives you advice that fits your family.</p>
            <div className="ob-field">
              <label>What&apos;s your name?</label>
              <input
                type="text"
                className="ob-input"
                placeholder="Your first name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="ob-field">
              <label>I am a…</label>
              <div className="ob-btn-group">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={`ob-choice-btn ${role === r.id ? "ob-choice-btn--active" : ""}`}
                    onClick={() => setRole(r.id)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="ob-step">
            <div className="ob-icon">🌱</div>
            <h2 className="ob-title">Your parenting journey</h2>
            <p className="ob-sub">This helps us know how much background to include in our advice.</p>
            <div className="ob-field">
              <label>Is this your first child?</label>
              <div className="ob-btn-group">
                <button
                  type="button"
                  className={`ob-choice-btn ${firstTime === true ? "ob-choice-btn--active" : ""}`}
                  onClick={() => setFirstTime(true)}
                >
                  Yes, first time!
                </button>
                <button
                  type="button"
                  className={`ob-choice-btn ${firstTime === false ? "ob-choice-btn--active" : ""}`}
                  onClick={() => setFirstTime(false)}
                >
                  No, I have experience
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="ob-step">
            <div className="ob-icon">👶</div>
            <h2 className="ob-title">About your children</h2>
            <p className="ob-sub">The AI will tailor advice to each child&apos;s exact age and stage.</p>
            <div className="ob-field">
              <label>How many children do you have?</label>
              <div className="ob-btn-group">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`ob-choice-btn ${childCount === n ? "ob-choice-btn--active" : ""}`}
                    onClick={() => handleChildCount(n)}
                  >
                    {n}{n === 4 ? "+" : ""}
                  </button>
                ))}
              </div>
            </div>
            <div className="ob-children-list">
              {children.map((child, i) => (
                <div key={i} className="ob-child-row">
                  <input
                    type="text"
                    className="ob-input ob-input--sm"
                    placeholder={`Child ${i + 1} nickname`}
                    value={child.nickname}
                    onChange={(e) => updateChild(i, "nickname", e.target.value)}
                  />
                  <select
                    className="ob-select"
                    value={child.ageRange}
                    onChange={(e) => updateChild(i, "ageRange", e.target.value)}
                  >
                    <option value="">Age range…</option>
                    {AGE_RANGES.map((a) => (
                      <option key={a.id} value={a.id}>{a.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="ob-step">
            <div className="ob-icon">🎯</div>
            <h2 className="ob-title">What are you working on?</h2>
            <p className="ob-sub">Pick the challenges you face most. The AI will prioritise these topics.</p>
            <div className="ob-chips">
              {CHALLENGES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`ob-chip ${challenges.includes(c) ? "ob-chip--active" : ""}`}
                  onClick={() => toggleChallenge(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <p className="ob-hint">Select at least one</p>
          </div>
        )}

        {step === 5 && (
          <div className="ob-step">
            <div className="ob-icon">💬</div>
            <h2 className="ob-title">How do you like advice given?</h2>
            <p className="ob-sub">We&apos;ll always respond in the style that works best for you.</p>
            <div className="ob-style-grid">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`ob-style-card ${style === s.id ? "ob-style-card--active" : ""}`}
                  onClick={() => setStyle(s.id)}
                >
                  <strong>{s.label}</strong>
                  <span>{s.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="ob-actions">
          {step > 1 && (
            <button type="button" className="btn-secondary ob-back-btn" onClick={back}>
              Back
            </button>
          )}
          <button
            type="button"
            className="btn-primary ob-next-btn"
            onClick={next}
            disabled={!canProceed() || saving}
          >
            {saving ? "Saving…" : step === TOTAL_STEPS ? `Let's go, ${name}!` : "Continue"}
          </button>
        </div>

        <p className="ob-skip" onClick={handleFinish}>Skip for now</p>
      </div>
    </div>
  );
}
