import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 right-0 h-14 z-50 bg-base-100 border-b border-base-300 shadow-sm px-3 sm:px-6 flex items-center">

        {/* Left */}
        <div className="flex-1">
          <NavLink
            to="/"
            className="btn btn-ghost text-lg sm:text-xl"
          >
            Parent App
          </NavLink>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex">
          <ul className="menu menu-horizontal px-1 gap-1">
            <li><NavLink to="/Blogs">Blogs</NavLink></li>
            <li><NavLink to="">Link 1</NavLink></li>
            <li><NavLink to="/CalmTool">Calm Tools</NavLink></li>
            <li><NavLink to="/Aboutus">About Us</NavLink></li>
          </ul>
        </div>

        {/* Mobile Button */}
        <div className="md:hidden">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {/* Hamburger */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* BACKDROP (IMPORTANT FIX) */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* MOBILE MENU */}
      <div
        className={`
          fixed top-14 right-3 w-56
          bg-base-100 border border-base-300
          rounded-xl shadow-lg z-50 md:hidden
          transform transition-all duration-200
          ${menuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
        `}
      >
        <ul className="menu p-2">
          <li><NavLink to="/Blogs" onClick={() => setMenuOpen(false)}>Blogs</NavLink></li>
          <li><NavLink to="" onClick={() => setMenuOpen(false)}>Link 1</NavLink></li>
          <li><NavLink to="/CalmTool" onClick={() => setMenuOpen(false)}>Calm Tools</NavLink></li>
          <li><NavLink to="/Aboutus" onClick={() => setMenuOpen(false)}>About Us</NavLink></li>
        </ul>
      </div>
    </>
  );
};

export default Header;