/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import ModelingCard from "../ModelingCard";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiX } from "react-icons/fi";
import { modelingCards } from "../ModelingGallery";
import Navbar from "../../../../Navbar/Navbar";

// Define the same sections as in Home component
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

const Gallery = () => {
  const { title } = useParams();
  const [activeSection, setActiveSection] = useState("modeling");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const galleryRef = useRef(null);

  // Find all images with matching type or title (case-insensitive)
  const images = modelingCards.filter(
    (img) =>
      img.type?.toLowerCase() === title?.toLowerCase() ||
      img.title?.toLowerCase().replace(/\s+/g, "-") === title?.toLowerCase()
  );

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openModal = (idx) => {
    setSelectedIndex(idx);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedIndex(null);
    document.body.style.overflow = "auto";
  };

  const showPrev = (e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const showNext = (e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  // Scroll to section in home page when nav item is clicked
  const handleNavClick = (id) => {
    if (id === "modeling") {
      // If clicking the modeling nav item, scroll to top of gallery
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Navigate to home page and scroll to section
      window.location.href = `/#${id}`;
    }
  };

  return (
    <div className="body-part-setup" ref={galleryRef}>
      {/* Add Navbar at the top */}
      <Navbar
        sections={sections}
        activeSection={activeSection}
        onNavClick={handleNavClick}
      />

      <div className="w-full min-h-screen bg-[#191919] pt-4 pb-10 px-4">
        <h1 className="text-3xl font-bold text-white mb-8 uppercase pt-16">
          {title.replace(/-/g, " ")}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {images.map((img, idx) => (
            <div
              key={img.img + idx}
              onClick={() => openModal(idx)}
              className="cursor-pointer"
            >
              <ModelingCard img={img.img} title={img.title} meta={img.meta} />
            </div>
          ))}
        </div>
        {selectedIndex !== null && (
          <div
            className="fixed inset-0 z-[9999] bg-black bg-opacity-80 flex items-center justify-center"
            onClick={closeModal}
          >
            <div
              className="relative max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={showPrev}
                className="fixed left-4 top-1/2 -translate-y-1/2 w-12 h-12 text-white hover:text-gray-300 z-[10000] cursor-pointer rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-200"
                aria-label="Previous image"
              >
                <IoIosArrowBack size={24} />
              </button>
              <button
                onClick={showNext}
                className="fixed right-4 top-1/2 -translate-y-1/2 w-12 h-12 text-white hover:text-gray-300 z-[10000] cursor-pointer rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-200"
                aria-label="Next image"
              >
                <IoIosArrowForward size={24} />
              </button>
              <button
                onClick={closeModal}
                className="fixed top-4 right-6 text-4xl text-white z-[10001] cursor-pointer"
                aria-label="Close"
              >
                <FiX />
              </button>
              <img
                src={images[selectedIndex].img}
                alt={images[selectedIndex].title}
                className="w-full max-h-[calc(100vh-130px)] my-[30px] object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
