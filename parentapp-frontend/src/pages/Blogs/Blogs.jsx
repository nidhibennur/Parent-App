import { useState, useEffect } from "react";

const sampleResources = [
  { id: 1, title: "Understanding Toddler Tantrums", tag: "Learn", icon: "📄" },
  { id: 2, title: "5-4-3-2-1 Grounding for Parents", tag: "Calm", icon: "🧘" },
  { id: 3, title: "Co-Regulation Basics", tag: "Learn", icon: "📚" },
  { id: 4, title: "Sleep Resistance at Age 2", tag: "Sleep", icon: "🌙" },
  { id: 5, title: "Box Breathing for Caregivers", tag: "Calm", icon: "🌬️" },
  { id: 6, title: "When You Feel Like You're Losing It", tag: "Support", icon: "💚" },
];

const Blogs = () => {
  const [documents, setDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  useEffect(() => {
    setDocuments(sampleResources);
  }, []);

  const totalPages = Math.ceil(documents.length / cardsPerPage) || 1;
  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentCards = documents.slice(startIndex, startIndex + cardsPerPage);

  return (
    <div className="page-content">
      <div className="section-tag">Resources</div>
      <h1 className="section-title">Educational library</h1>
      <p className="section-sub" style={{ marginBottom: 48 }}>
        Curated articles and guides on child development, emotional regulation, and
        calm parenting strategies.
      </p>

      <div className="features-grid" style={{ marginTop: 0 }}>
        {currentCards.map((doc) => (
          <div key={doc.id} className="feature-card sage">
            <div className="feature-icon icon-sage">{doc.icon}</div>
            <h3>{doc.title}</h3>
            <p>Evidence-based parenting resource — preview coming soon.</p>
            <span className="dash-res-tag" style={{ marginTop: 12, display: "inline-block" }}>
              {doc.tag}
            </span>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 40 }}>
          <button
            type="button"
            className="btn-secondary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn-secondary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Blogs;
