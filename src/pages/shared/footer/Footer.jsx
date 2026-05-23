import { Link } from "react-router-dom";

const Footer = ({ showProjectLink = true }) => {
  return (
    <footer className="site-footer">
      <Link to="/" className="nav-logo">
        <div className="logo-img" />
        <div className="logo-text">
          parent<span>app</span>
        </div>
      </Link>
      <div className="footer-note">OTH Amberg-Weiden · PARENT-APP</div>
      {showProjectLink && (
        <div className="footer-contact">
          <Link to="/welcome">Project overview</Link>
          {" · "}
          <a href="mailto:n.bennur@oth-aw.de">n.bennur@oth-aw.de</a>
        </div>
      )}
    </footer>
  );
};

export default Footer;
