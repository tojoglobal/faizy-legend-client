import { useRef, useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Section from "../Section/Section";
import { useScroll } from "../context/ScrollContext";
import { useAppContext } from "../context/useAppContext";
import VideoModal from "./../Section/Content/Filming/VideoModal";

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

function Home() {
  const { openVideo, setOpenVideo, selectedCard } = useAppContext();
  const sectionRefs = useRef([]);
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const { scrollToSection, setScrollToSection } = useScroll();

  // Scroll to target section after navigation from Gallery
  useEffect(() => {
    if (scrollToSection) {
      const idx = sections.findIndex((s) => s.id === scrollToSection);
      if (sectionRefs.current[idx]) {
        sectionRefs.current[idx].scrollIntoView({ behavior: "smooth" });
      }
      setScrollToSection(null); // Reset so it doesn't happen again
    }
  }, [scrollToSection, setScrollToSection]);

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

  const scrollToSectionHandler = (id) => {
    const idx = sections.findIndex((s) => s.id === id);
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="body-part-setup">
      <VideoModal
        open={!!openVideo}
        onClose={() => setOpenVideo(null)}
        youtubeId={selectedCard?.youtube_id}
        title={selectedCard?.title}
      />
      <Navbar
        sections={sections}
        activeSection={activeSection}
        onNavClick={scrollToSectionHandler}
      />

      {sections.map((section, idx) => (
        <Section
          key={section.id}
          section={section}
          ref={(el) => (sectionRefs.current[idx] = el)}
          scrollToSection={scrollToSectionHandler}
        />
      ))}
    </div>
  );
}

export default Home;
