import { useState } from "react";
import "./Navbar.css";

function Navbar({ sections, activeSection, onNavClick }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (id, i) => {
    onNavClick(id, i);
    setMobileOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="logo cursor-pointer">
        <img
          onClick={() => handleNavClick("hero")}
          className="w-[65px] h-[65px]"
          src="https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/01/icon.png"
          alt="logo"
        />
      </div>
      {/* Hamburger Button */}
      <button
        className="menu-toggle"
        aria-label="Open menu"
        onClick={() => setMobileOpen(true)}
      >
        <span></span>
      </button>
      {/* Desktop Nav */}
      <ul className="nav-list">
        {sections.map((s, i) => (
          <li
            key={s.id}
            className={`nav-item ${activeSection === s.id ? "active" : ""}`}
            onClick={() => handleNavClick(s.id, i)}
          >
            {s.label}
          </li>
        ))}
      </ul>
      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div className="mobile-nav">
          <button
            className="mobile-nav-close"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >
            &times;
          </button>
          <ul className="mobile-nav-list">
            {sections.map((s, i) => (
              <li
                key={s.id}
                className={`mobile-nav-item ${
                  activeSection === s.id ? "active" : ""
                }`}
                onClick={() => handleNavClick(s.id, i)}
              >
                {s.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
