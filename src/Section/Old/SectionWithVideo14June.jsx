import { forwardRef, useEffect, useRef, useState } from "react";
import "./Section.css";
import { FaRegArrowAltCircleDown } from "react-icons/fa";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";
import AboutContent from "../Content/About/AboutContent";
import ModelingGallery from "../Content/Modeling/ModelingGallery";
import FilmingGallery from "../Content/Filming/FilmingGallery";
import Ugc from "../Content/UGC/Ugc";
import ArticleGrid from "../Content/ArticleGrid/ArticleGrid";
import BookForm from "../Content/BookForm/BookForm";
import Shopping from "../Content/Shop/Shopping";

const sectionBackgrounds = {
  about: "url('./Images/abouthero.webp')",
  modeling: "url('./Images/modelingHero.webp')",
  filming: "url('./Images/filmingHero.webp')",
  ugc: "url('./Images/ugcHero.webp')",
  articles: "url('./Images/articlesHero.webp')",
  book: "url('./Images/bookHero.webp')",
  shop: "url('./Images/shopHero.webp')",
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
  const videoRef = useRef(null);

  useEffect(() => {
    // Ensure video plays when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Autoplay prevented:", error);
      });
    }
  }, []);

  // Hero Section
  if (section.id === "hero") {
    return (
      <section id={section.id} className="hero-full-section" ref={ref}>
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="background-video"
          // Important attributes for mobile support
          webkit-playsinline="true"
          x-webkit-airplay="allow"
          x5-playsinline="true"
          disablePictureInPicture
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="section-content">
          <h1 className="big-title pt-[43vh]">FAIZY LEGEND</h1>
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
        backgroundPosition: "center top",
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
