import { forwardRef, useRef, useState } from "react";
import "./Section.css";
import { FaRegArrowAltCircleDown } from "react-icons/fa";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import AboutContent from "./Content/About/AboutContent";
import ModelingGallery from "./Content/Modeling/ModelingGallery";
import FilmingGallery from "./Content/Filming/FilmingGallery";
import Ugc from "./Content/UGC/Ugc";
import ArticleGrid from "./Content/ArticleGrid/ArticleGrid";
import BookForm from "./Content/BookForm/BookForm";
import Shopping from "./Content/Shop/Shopping";

const sectionBackgrounds = {
  about:
    "url('https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/01/ad-1-_2_.webp')",
  modeling:
    "url('https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/01/Artboard-Copy-1aaa-scaled.webp')",
  filming:
    "url('https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/01/Artboard-f_11zon.webp')",
  ugc: "url('https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/01/Screen-Shot-2025-01-20-at-3.10.55-PM.png')",
  articles:
    "url('https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/01/wmremove-transformed-1_11zon.webp')",
  book: "url('https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/01/image.png')",
  shop: "url('https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/03/trainer.png')",
};

const heroVideo = "/video/Home-Banner-online-video-cutter.mp4";

const sectionContents = {
  about: {
    title: "Introduction",
    text: <AboutContent />,
  },
  modeling: {
    title: "",
    text: <ModelingGallery />,
  },
  filming: {
    title: "",
    text: <FilmingGallery />,
  },
  ugc: {
    title: "",
    text: <Ugc />,
  },
  articles: {
    title: "",
    text: <ArticleGrid />,
  },
  book: {
    title: "",
    text: <BookForm />,
  },
  shop: {
    title: "Shop",
    text: <Shopping />,
  },
};

const Section = forwardRef(({ section, scrollToSection }, ref) => {
  const [open, setOpen] = useState(false);
  const contentPartRef = useRef(null);

  // Hero Section
  if (section.id === "hero") {
    return (
      <section id={section.id} className="hero-full-section" ref={ref}>
        <video autoPlay loop muted playsInline className="background-video">
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="section-content">
          <h1 className="big-title pt-[45vh]">FAIZY LEGEND</h1>
          <div className="hero_subtitle mt-[4rem]">
            MODEL | ACTOR | INFLUENCER
          </div>
          <div
            className="hero-scroll-down"
            onClick={() => scrollToSection && scrollToSection("about")}
            aria-label="Scroll to About"
          >
            <FaRegArrowAltCircleDown />
          </div>
        </div>
      </section>
    );
  }

  // Other Sections
  const bg = sectionBackgrounds[section.id] || "#191919";
  const content = sectionContents[section.id];

  // MULTI-ACTION HANDLER for the plus button
  const handlePlusClick = () => {
    setOpen(true);
    setTimeout(() => {
      if (contentPartRef.current) {
        contentPartRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  // Multi-action handler for minus button
  const handleMinusClick = () => {
    setOpen(false);
    if (scrollToSection) {
      scrollToSection(section.id);
    } else if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const isMobile = window.innerWidth < 1024;

  return (
    <section
      id={section.id}
      className="full-section section-background"
      ref={ref}
      style={{
        backgroundImage: bg,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        // backgroundAttachment: "fixed",
        backgroundAttachment: isMobile ? "scroll" : "fixed",
      }}
    >
      <div className="bg-overlay" />
      <div className="text_full_section">
        <h1 className="section-title font-oswald">{section.label}</h1>
        <div
          className="section-plus-btn"
          onClick={handlePlusClick}
          aria-label="Open Content"
        >
          <FiPlusCircle />
        </div>
      </div>
      {/* Content Modal/Panel */}
      <div
        ref={contentPartRef}
        className={`content-part ${open ? "open" : ""}`}
        style={{ display: open ? "block" : "none" }}
      >
        <div className="scroll_minus_btn" onClick={handleMinusClick}>
          <FiMinusCircle />
        </div>
        <div className="content-inner w-full md:max-w-10/12">
          <h2 className={`content-title ${section?.id}_content_title`}>
            {content?.title}
          </h2>
          <div className={`content-text ${section?.id}_content_text`}>
            {content?.text}
          </div>
        </div>
      </div>{" "}
    </section>
  );
});

export default Section;
