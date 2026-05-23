const features = [
  {
    accent: "sage",
    iconClass: "icon-sage",
    icon: "🤖",
    title: "AI Chat Support",
    text: "Describe your situation and get calm, context-aware guidance powered by Claude. No judgment, just help — in seconds.",
  },
  {
    accent: "blush",
    iconClass: "icon-blush",
    icon: "🌬️",
    title: "Calm-Down Toolkit",
    text: "Breathing exercises, grounding techniques, and sensory tools designed to help both you and your child regulate emotions quickly.",
  },
  {
    accent: "sky",
    iconClass: "icon-sky",
    icon: "📚",
    title: "Educational Library",
    text: "Browse curated articles, videos, and guides on child development, attachment theory, and co-regulation — all in one place.",
  },
  {
    accent: "lavender",
    iconClass: "icon-lav",
    icon: "📊",
    title: "Personal Dashboard",
    text: "Track your emotional patterns, save favorite strategies, and build a personalized toolkit over time based on what works for you.",
  },
  {
    accent: "lemon",
    iconClass: "icon-lemon",
    icon: "💾",
    title: "Saved Sessions",
    text: "Every conversation is saved and searchable. Look back at strategies that helped you before and apply them again instantly.",
  },
  {
    accent: "rose",
    iconClass: "icon-rose",
    icon: "🔔",
    title: "Gentle Reminders",
    text: "Set check-ins for yourself throughout the day. The app nudges you with short practices before stress escalates.",
  },
];

export default function Features() {
  return (
    <section className="landing-section" id="features">
      <div className="section-inner">
        <div className="section-tag">Everything you need</div>
        <h2 className="section-title">
          Built for real moments,
          <br />
          not ideal ones
        </h2>
        <p className="section-sub">
          Designed for parents in the thick of it — when patience is thin and you need
          answers fast.
        </p>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className={`feature-card ${f.accent}`}>
              <div className={`feature-icon ${f.iconClass}`}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
