import { Link } from "react-router-dom";
import { LEARNING_TOPICS } from "../../data/learningTopics";

export default function Learning() {
  return (
    <main className="page-content">
      <div className="section-tag">Learning</div>
      <h1 className="section-title">Structured parenting knowledge</h1>
      <p className="section-sub" style={{ marginBottom: 48 }}>
        Card-based guides — tap any topic for step-by-step help, do&apos;s and don&apos;ts.
      </p>

      <div className="features-grid" style={{ marginTop: 0 }}>
        {LEARNING_TOPICS.map((topic) => (
          <Link
            key={topic.id}
            to={`/learn/${topic.id}`}
            className={`feature-card ${topic.accent} learning-card-link`}
          >
            <div
              className={`feature-icon ${
                topic.accent === "lavender"
                  ? "icon-lav"
                  : topic.accent === "lemon"
                    ? "icon-lemon"
                    : `icon-${topic.accent}`
              }`}
            >
              {topic.icon}
            </div>
            <h3>{topic.title}</h3>
            <p>{topic.summary}</p>
            <span className="learning-card-cta">Read guide →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
