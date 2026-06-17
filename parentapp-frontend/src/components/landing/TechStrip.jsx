const tech = [
  { color: "#4a7c59", label: "Claude AI" },
  { color: "#059669", label: "FastAPI" },
  { color: "#4CAF50", label: "MongoDB" },
  { color: "#5b8fba", label: "React" },
  { color: "#f59e0b", label: "Python" },
  { color: "#8b6dab", label: "REST API" },
];

export default function TechStrip() {
  return (
    <div className="tech-strip">
      <div className="tech-inner">
        <span className="tech-label">Tech Stack</span>
        <div className="tech-items">
          {tech.map((t) => (
            <div key={t.label} className="tech-pill">
              <div className="tech-pill-dot" style={{ background: t.color }} />
              {t.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
