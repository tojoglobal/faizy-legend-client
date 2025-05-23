import { forwardRef, useRef, useState } from "react";
import "./Section.css";
import { FaRegArrowAltCircleDown } from "react-icons/fa";
import { FiMinusCircle, FiPlusCircle } from "react-icons/fi";

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

const sectionContents = {
  about: {
    title: "Introduction",
    text: (
      <>
        <p>
          Meet Faizy Legend, a dynamic social media influencer and advocate who
          has captured the hearts of over 300,000 followers worldwide. Born with
          deafness and vitiligo, Faizy has turned what many might see as
          challenges into a platform for inspiration, proving that our
          differences are what make us truly extraordinary. His journey is a
          testament to resilience, self-love, and the power of kindness.
        </p>
        <p>
          Faizy’s vibrant content is a mix of heartfelt storytelling, empowering
          messages, and creative visuals that encourages his audience to embrace
          their unique identities. By sharing his personal experiences,
          navigating life with hearing loss and celebrating the beauty of his
          vitiligo, Faizy has fostered understanding, broken down stereotypes,
          and inspired countless individuals to embrace their authentic selves.
        </p>
        <p>
          What sets Faizy apart is his unwavering positivity and his commitment
          to spreading love and compassion. His advocacy goes beyond inspiring
          individuals; he has built a community where everyone feels seen,
          heard, and valued. Faizy’s message is simple yet powerful: challenges
          are not obstacles but opportunities to grow stronger and shine
          brighter.
        </p>
        <p>
          As a champion for self-acceptance and inclusivity, Faizy now sets his
          sights on a new dream, pursuing a career in acting and modeling. But
          his goal isn’t fame or fortune. Faizy wants to step into those
          industries to show the world that anything is possible, regardless of
          the challenges one might face. By entering the world of entertainment,
          he aims to inspire others to break free from limitations, believe in
          their potential, and chase their dreams with courage and
          determination.
        </p>
        <p>
          When you follow Faizy Legend, you’re not just scrolling through
          content; you’re joining a movement of empowerment, hope, and
          unconditional love. Whether through heartfelt captions, engaging
          videos, or creative projects, Faizy proves that kindness, courage, and
          authenticity have the power to change lives.
        </p>
      </>
    ),
  },
  modeling: {
    title: "Modeling Experience",
    text: (
      <div className="modeling-gallery">
        <div className="gallery-card">
          <img src="/gallery/mountain-vibes.webp" alt="Mountain Vibes" />
          <div className="gallery-caption">
            <div className="gallery-title">MOUNTAIN VIBES</div>
            <div className="gallery-meta">
              Phoenix, Arizona | @ellvieritchphoto
            </div>
          </div>
        </div>
        <div className="gallery-card">
          <img src="/gallery/leopard-style.webp" alt="Leopard In Style" />
          <div className="gallery-caption">
            <div className="gallery-title">LEOPARD IN STYLE</div>
            <div className="gallery-meta">Houston, Texas | @valentinoui</div>
          </div>
        </div>
        <div className="gallery-card">
          <img src="/gallery/shadowed-silence.webp" alt="Shadowed Silence" />
          <div className="gallery-caption">
            <div className="gallery-title">SHADOWED SILENCE</div>
            <div className="gallery-meta">Katy, Texas | @pdl_photography</div>
          </div>
        </div>
        <div className="gallery-card">
          <img src="/gallery/suited-savage.webp" alt="Suited But Savage" />
          <div className="gallery-caption">
            <div className="gallery-title">SUITED BUT SAVAGE</div>
            <div className="gallery-meta">
              Houston, Texas | @skinmintclinent
            </div>
          </div>
        </div>
      </div>
    ),
  },
  filming: {
    title: "Filming",
    text: "Faizy has featured in various film and video projects, demonstrating a flair for storytelling and on-screen performance.",
  },
  ugc: {
    title: "User Generated Content",
    text: "Faizy actively collaborates with brands and fans, co-creating engaging and authentic content for digital platforms.",
  },
  articles: {
    title: "Articles",
    text: "Explore articles and press features about Faizy's career, achievements, and creative philosophy.",
  },
  book: {
    title: "Book",
    text: "For bookings and professional inquiries, connect with Faizy for collaborations in modeling, acting, or brand partnerships.",
  },
  shop: {
    title: "Shop",
    text: "Check out exclusive merchandise, curated by Faizy, reflecting personal style and creativity.",
  },
};

const Section = forwardRef(({ section, scrollToSection }, ref) => {
  const [open, setOpen] = useState(false);
  const contentPartRef = useRef(null);

  // Hero Section
  if (section.id === "hero") {
    return (
      <section id={section.id} className="hero-full-section" ref={ref}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="background-video"
          poster="https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/01/icon.png"
        >
          <source
            src="https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/02/Home-Banner-online-video-cutter.com_-1.mp4"
            type="video/mp4"
          />
        </video>
        <div className="section-content">
          <h1 className="big-title pt-[50vh]">FAIZY LEGEND</h1>
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

  return (
    <section
      id={section.id}
      className="full-section section-background"
      ref={ref}
      style={{
        backgroundImage: bg,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
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
      {/* Content Part */}
      <div
        ref={contentPartRef}
        className={`content-part ${open ? "open" : ""}`}
        style={{ display: open ? "block" : "none" }}
      >
        <div className="scroll_minus_btn" onClick={handleMinusClick}>
          <FiMinusCircle />
        </div>
        <div className="content-inner max-w-9/12">
          <h2 className="content-title">{content?.title}</h2>
          <p className="content-text">{content?.text}</p>
        </div>
      </div>{" "}
    </section>
  );
});

export default Section;
