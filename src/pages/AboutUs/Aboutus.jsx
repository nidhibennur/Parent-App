const Aboutus = () => {
  return (
    <div className="page-content">
      <div className="section-tag">About PARENT-APP</div>
      <h1 className="section-title">Support for parents in hard moments</h1>
      <p className="section-sub" style={{ maxWidth: 720 }}>
        Caring for infants and young children during crying episodes, tantrums, or other
        emotionally demanding moments can place parents under significant psychological
        pressure. PARENT-APP offers immediate AI-guided support and accessible emotional
        regulation tools so caregivers can respond more safely and effectively.
      </p>
      <div className="features-grid" style={{ marginTop: 48 }}>
        <div className="feature-card sage">
          <div className="feature-icon icon-sage">🎯</div>
          <h3>Our mission</h3>
          <p>
            Every parent deserves calm, judgment-free guidance when stress is highest.
          </p>
        </div>
        <div className="feature-card sky">
          <div className="feature-icon icon-sky">🔬</div>
          <h3>Evidence-based</h3>
          <p>
            Strategies grounded in attachment theory, co-regulation, and child development
            research.
          </p>
        </div>
        <div className="feature-card lavender">
          <div className="feature-icon icon-lav">🛡️</div>
          <h3>Safe AI</h3>
          <p>
            Structured prompts and safety rules keep every response appropriate and calm.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
