import { Link } from "react-router-dom";

export default function Cta() {
  return (
    <section className="cta-section">
      <div className="cta-inner">
        <h2>Every parent deserves support in the hard moments</h2>
        <p>PARENT-APP is being built with you in mind. Be the first to try it when we launch.</p>
        <Link to="/" className="btn-white">
          Try the app →
        </Link>
      </div>
    </section>
  );
}
