import "./Navbar.css";

function Navbar({ sections, activeSection, onNavClick }) {
  return (
    <nav className="navbar">
      <div className="logo">
        <img
          className="w-[65px] h-[65px]"
          src="https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/01/icon.png"
          alt="logo"
        />
      </div>
      <ul className="nav-list">
        {sections.map((s, i) => (
          <li
            key={s.id}
            className={`nav-item ${activeSection === s.id ? "active" : ""}`}
            onClick={() => onNavClick(s.id, i)}
          >
            {s.label}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
