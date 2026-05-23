const team = [
  { initials: "VN", color: "#5b8fba", name: "Vishal Naroju", role: "UI implementation & component integration", badge: "Frontend", badgeClass: "badge-fe" },
  { initials: "DM", color: "#378add", name: "Dinesh Mariappan", role: "UI design, usability & styling", badge: "Frontend", badgeClass: "badge-fe" },
  { initials: "AM", color: "#185fa5", name: "Animesh Mondol", role: "Chat interface & frontend-backend integration", badge: "Frontend", badgeClass: "badge-fe" },
  { initials: "MG", color: "#4a7c59", name: "Mitali Gaikwad", role: "API development & MongoDB integration", badge: "Backend", badgeClass: "badge-be" },
  { initials: "NB", color: "#8b6dab", name: "Nidhi Bennur", role: "AI integration & prompt engineering", badge: "AI Lead", badgeClass: "badge-ai" },
  { initials: "HE", color: "#c8a83c", name: "Hafiz Ehtasham", role: "Testing, debugging & documentation", badge: "QA", badgeClass: "badge-qa" },
];

export default function Team() {
  return (
    <section className="landing-section team-section" id="team">
      <div className="section-inner">
        <div className="section-tag">The team</div>
        <h2 className="section-title">
          Built by passionate developers
          <br />
          at OTH Amberg-Weiden
        </h2>
        <p className="section-sub">
          A multidisciplinary team bringing together frontend craft, backend engineering, AI
          integration, and quality assurance.
        </p>
        <div className="team-grid">
          {team.map((m) => (
            <div key={m.name} className="team-card">
              <div className="team-avatar" style={{ background: m.color }}>
                {m.initials}
              </div>
              <div className="team-name">{m.name}</div>
              <div className="team-role">{m.role}</div>
              <div className={`team-role-badge ${m.badgeClass}`}>{m.badge}</div>
            </div>
          ))}
        </div>
        <div className="team-contact-bar">
          <div style={{ fontSize: "1.5rem" }}>📧</div>
          <div>
            <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Project Contact
            </div>
            <div style={{ color: "white", fontWeight: 600 }}>Nidhi Pramod Bennur</div>
            <a href="mailto:n.bennur@oth-aw.de" style={{ color: "#8ed4a3", fontSize: "0.85rem", textDecoration: "none" }}>
              n.bennur@oth-aw.de
            </a>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)" }}>Final submission</div>
            <div style={{ color: "white", fontWeight: 600 }}>5 July 2026</div>
          </div>
        </div>
      </div>
    </section>
  );
}
