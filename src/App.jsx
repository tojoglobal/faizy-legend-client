import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import Navbar from "./Navbar/Navbar";
import Section from "./Section/Section";

const sections = [
  { id: "hero", label: "" },
  { id: "about", label: "ABOUT" },
  { id: "modeling", label: "MODELING" },
  { id: "filming", label: "FILMING" },
  { id: "ugc", label: "UGC" },
  { id: "articles", label: "ARTICLES" },
  { id: "book", label: "BOOK" },
  { id: "shop", label: "SHOP" },
];

function App() {
  const sectionRefs = useRef([]);
  const [activeSection, setActiveSection] = useState(sections[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2;
      for (let i = 0; i < sections.length; i++) {
        const ref = sectionRefs.current[i];
        if (ref) {
          const { offsetTop, offsetHeight } = ref;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(sections[i].id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const idx = sections.findIndex((s) => s.id === id);
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <Navbar
        sections={sections}
        activeSection={activeSection}
        onNavClick={(id, i) => scrollToSection(id)}
      />
      {sections.map((section, idx) => (
        <Section
          key={section.id}
          section={section}
          ref={(el) => (sectionRefs.current[idx] = el)}
          scrollToSection={scrollToSection}
        />
      ))}
    </div>
  );
}

export default App;
