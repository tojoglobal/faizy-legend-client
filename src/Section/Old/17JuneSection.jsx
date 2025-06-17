import { forwardRef, useRef, useState } from "react";
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
  hero: "url('./Images/sectionHero.jpg')",
  about: "url('./Images/abouthero.webp')",
  modeling: "url('./Images/modelingHero.webp')",
  filming: "url('./Images/filmingHero.webp')",
  ugc: "url('./Images/ugcHero.webp')",
  articles: "url('./Images/articlesHero.webp')",
  book: "url('./Images/bookHero.webp')",
  shop: "url('./Images/shopHero.webp')",
};

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

  const bg = sectionBackgrounds[section.id] || "#191919";
  const content = sectionContents[section.id];
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  if (section.id === "hero") {
    return (
      <section
        id={section.id}
        ref={ref}
        className={
          section.id === "hero"
            ? "hero-full-section section-background"
            : "full-section section-background"
        }
        style={{
          // backgroundImage: "url('./Images/sectionHero.jpg')",
          backgroundImage: bg,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: isMobile ? "scroll" : "fixed",
        }}
      >
        <div className="bg-overlay" />
        <div className="section-content">
          {/* <h1 className="big-title font-oswald pt-[43vh]">FAIZY LEGEND</h1> */}
          <h1 className="font-oswald pt-[43vh] text-5xl md:text-[165px]  font-normal tracking-[8px] uppercase text-white leading-[1.05] m-0">
            FAIZY LEGEND
          </h1>
          <div className="hero_subtitle font-oswald mt-[4rem]">
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

  const handlePlusClick = () => {
    setOpen(true);
    setTimeout(() => {
      contentPartRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const handleMinusClick = () => {
    setOpen(false);
    scrollToSection
      ? scrollToSection(section.id)
      : ref?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      {/* Section Background with Plus Button */}
      <section
        id={section.id}
        ref={ref}
        className={
          section.id === "hero"
            ? "hero-full-section section-background"
            : "full-section section-background"
        }
        style={{
          backgroundImage: bg,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: isMobile ? "scroll" : "fixed",
        }}
      >
        <div className="bg-overlay" />

        <div className="text_full_section">
          {/* <h1 className="section-title font-oswald">{section.label}</h1> */}
          <h1 className="font-oswald text-5xl md:text-[150px] font-normal tracking-[6px] leading-[1] m-0 uppercase text-white">
            {section.label}
          </h1>
          <div
            className="section-plus-btn"
            onClick={handlePlusClick}
            aria-label="Open Content"
          >
            <FiPlusCircle />
          </div>
        </div>
      </section>

      {/* Content Part (Outside Background Section) */}

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
      </div>
    </>
  );
});

export default Section;
