import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { QUICK_ACTIONS } from "../../data/quickActions";
import { useAuth } from "../../context/AuthContext";
import { saveMoodEntry, fetchMoodLog } from "../../utils/moodApi";

const MOODS = [
  {
    id: "great",
    emoji: "😊",
    label: "Feeling good",
    color: "#d4e9d9",
    accent: "#2d6349",
    advice: "Love this. Take a second to notice what's going right today — a calm morning, a good night's sleep, a small win with your child. Banking these moments helps you remember them on the harder days.",
    links: [],
  },
  {
    id: "okay",
    emoji: "😌",
    label: "Okay, managing",
    color: "#dceefa",
    accent: "#1a6b82",
    advice: "Steady is good. You're holding things together, which is its own kind of strength. If you've got a spare minute, a short breathing exercise can help keep that balance through the rest of the day.",
    links: [{ label: "Try box breathing →", to: "/calm-tools" }],
  },
  {
    id: "stressed",
    emoji: "😕",
    label: "A bit stressed",
    color: "#fde8d0",
    accent: "#a05a1a",
    advice: "That tightness you're feeling is real, and it's okay to name it. Try stepping away for 30 seconds before responding to whatever's pulling at you — your child needs your calm, not your perfection. A quick reset or a tip might help right now.",
    links: [
      { label: "Calm Tools →", to: "/calm-tools" },
      { label: "Browse tips →", to: "/tips" },
    ],
  },
  {
    id: "overwhelmed",
    emoji: "😔",
    label: "Overwhelmed",
    color: "#ede5f6",
    accent: "#5c3d8a",
    advice: "Overwhelmed means you're carrying a lot, not that you're failing. Give yourself permission to pause — even just stepping into another room for a few breaths counts. You've gotten through hard moments before, and this one will pass too.",
    links: [
      { label: "30-second reset →", to: "/calm-tools" },
      { label: "Talk to AI →", to: `/?${new URLSearchParams({ prompt: QUICK_ACTIONS[1].prompt, topic: "overwhelmed" })}` },
    ],
  },
  {
    id: "crisis",
    emoji: "😤",
    label: "In crisis",
    color: "#fde6e7",
    accent: "#a82d38",
    advice: "If you or your child are in immediate danger, please call emergency services now. Otherwise, the Emergency page has grounding steps and crisis resources to help you through this moment — you don't have to handle it alone.",
    links: [{ label: "Go to Emergency page →", to: "/emergency" }],
  },
];

function saveLog(moodId, userKey) {
  const storageKey = userKey ? `mood-log_${userKey}` : "mood-log";
  const date = new Date().toISOString();
  try {
    const logs = JSON.parse(localStorage.getItem(storageKey) || "[]");
    logs.unshift({ moodId, date });
    localStorage.setItem(storageKey, JSON.stringify(logs.slice(0, 30)));
  } catch { /* noop */ }
  saveMoodEntry(moodId, date);
}

const MOOD_SCORE = { great: 5, okay: 4, stressed: 3, overwhelmed: 2, crisis: 1 };
const MOOD_COLOR = { great: "#2d6349", okay: "#1a6b82", stressed: "#a05a1a", overwhelmed: "#5c3d8a", crisis: "#a82d38" };

function buildWeekData(logs) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { label: d.toLocaleDateString("en", { weekday: "short" }), dateStr: d.toISOString().slice(0, 10), scores: [] };
  });
  logs.forEach(({ moodId, date }) => {
    const ds = new Date(date).toISOString().slice(0, 10);
    const day = days.find((d) => d.dateStr === ds);
    if (day && MOOD_SCORE[moodId]) day.scores.push(MOOD_SCORE[moodId]);
  });
  return days.map((d) => ({
    label: d.label,
    score: d.scores.length ? Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length * 10) / 10 : null,
    fill: d.scores.length ? Object.entries(MOOD_SCORE).find(([, v]) => v === Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length))?.[0] : null,
  }));
}

export default function MoodCheckin() {
  const { userKey } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [weekData, setWeekData] = useState([]);

  useEffect(() => {
    fetchMoodLog().then((logs) => {
      if (logs.length) setWeekData(buildWeekData(logs));
      else {
        try {
          const local = JSON.parse(localStorage.getItem(userKey ? `mood-log_${userKey}` : "mood-log") || "[]");
          if (local.length) setWeekData(buildWeekData(local));
        } catch { /* noop */ }
      }
    });
  }, []);

  function pick(mood) {
    if (selected?.id === mood.id) return;
    setSelected(mood);
    saveLog(mood.id, userKey);
  }

  return (
    <main className="page-content mood-page">
      <div className="section-tag">Mood Check-in</div>
      <h1 className="section-title">How are you feeling right now?</h1>
      <p className="section-sub">
        Pick the one that fits best. No judgement — just honest.
      </p>

      <div className="mood-grid">
        {MOODS.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`mood-card ${selected?.id === m.id ? "mood-card--active" : ""}`}
            style={{ "--mood-color": m.color, "--mood-accent": m.accent }}
            onClick={() => pick(m)}
          >
            <span className="mood-emoji">{m.emoji}</span>
            <span className="mood-label">{m.label}</span>
          </button>
        ))}
      </div>

      {selected && (
        <section className="mood-result" key={selected.id}>
          <div className="mood-result-header" style={{ background: selected.color }}>
            <span className="mood-result-emoji">{selected.emoji}</span>
            <div>
              <p className="mood-result-label" style={{ color: selected.accent }}>You selected</p>
              <h3 className="mood-result-name" style={{ color: selected.accent }}>{selected.label}</h3>
            </div>
          </div>
          <div className="mood-result-body">
            <div className="mood-result-text">
              <p>{selected.advice}</p>
            </div>
            <div className="mood-result-links">
              {selected.links.map((l) => (
                <Link key={l.to} to={l.to} className="btn-primary">
                  {l.label}
                </Link>
              ))}
              <button
                type="button"
                className="btn-secondary mood-chat-btn"
                onClick={() => {
                  const prompt = `I just checked in and I'm feeling "${selected.label}". I'd like to talk more about this and get some support.`;
                  navigate(`/?prompt=${encodeURIComponent(prompt)}&topic=mood-${selected.id}`);
                }}
              >
                💬 Talk more about this
              </button>
            </div>
          </div>
        </section>
      )}

      {weekData.some((d) => d.score !== null) && (
        <section className="mood-chart-section">
          <h3 className="mood-chart-title">Your week at a glance</h3>
          <p className="mood-chart-sub">Average mood score per day (5 = great, 1 = crisis)</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekData} barCategoryGap="30%">
              <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} hide />
              <Tooltip
                formatter={(val) => [`${val} / 5`, "Mood"]}
                contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: "0.82rem" }}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {weekData.map((d, i) => (
                  <Cell key={i} fill={d.fill ? MOOD_COLOR[d.fill] : "var(--border)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}

      <p className="mood-log-note">Your check-ins are saved to your account to help track patterns over time.</p>
    </main>
  );
}
