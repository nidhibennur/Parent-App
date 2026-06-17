import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Smile, Wind, BookOpen, Lightbulb, Star, User } from "lucide-react";

const navItems = [
  { to: "/mood",        label: "Mood",       Icon: Smile },
  { to: "/calm-tools",  label: "Calm",        Icon: Wind },
  { to: "/learn",       label: "Learn",       Icon: BookOpen },
  { to: "/tips",        label: "Tips",        Icon: Lightbulb },
  { to: "/milestones",  label: "Milestones",  Icon: Star },
  { to: "/profile",     label: "Profile",     Icon: User },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="site-nav">
      <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
        <div className="logo-img" role="img" aria-label="ParentApp logo" />
        <div className="logo-text">
          parent<span>app</span>
        </div>
      </Link>

      <button
        type="button"
        className="nav-toggle"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        {navItems.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => isActive ? "nav-active" : undefined}
            >
              <Icon size={15} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Header;
