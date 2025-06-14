import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../../../Navbar/Navbar";
import { FiX } from "react-icons/fi";
import { useScroll } from "../../../../context/ScrollContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

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

const API_URL = `${import.meta.env.VITE_OPEN_APIURL}/api/modeling-gallery`;

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function getImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const base = import.meta.env.VITE_OPEN_APIURL;
  return `${base}/${path.replace(/^\/+/, "")}`;
}

const Gallery = () => {
  const { title } = useParams();
  const [activeSection] = useState("modeling");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const navigate = useNavigate();
  const { setScrollToSection } = useScroll();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const {
    data: galleries = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["modeling-gallery"],
    queryFn: async () => {
      const res = await axios.get(API_URL);
      return res.data;
    },
  });

  const gallery =
    galleries.find((g) => slugify(g.name) === title?.toLowerCase()) || null;
  const images = gallery?.images || [];

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

  const handleNavClick = (id) => {
    setScrollToSection(id);
    navigate("/");
  };

  // Responsive 4-column grid, masonry/flex style, max/min height, auto width, gap
  return (
    <div className="body-part-setup bg-[#191919]">
      <Navbar
        sections={sections}
        activeSection={activeSection}
        onNavClick={handleNavClick}
      />
      <div className="max-w-7xl mx-auto min-h-screen py-10 px-4">
        <h1 className="text-[32px]  text-center font-bold text-white mb-2 uppercase pt-32">
          {gallery?.name || title?.replace(/-/g, " ")}
        </h1>
        <div className="text-center text-white text-[18px] mb-8">
          {gallery?.location}
          {gallery?.photographer ? ` |  @ ${gallery.photographer}` : ""}
        </div>
        {isLoading ? (
          <div className="text-center text-gray-300 py-16">Loading...</div>
        ) : isError ? (
          <div className="text-center text-red-400 py-16">
            {error?.message || "Error loading gallery"}
          </div>
        ) : !gallery ? (
          <div className="text-center text-gray-400 py-16">
            Gallery not found.
          </div>
        ) : images.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            No images in this gallery.
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 xl:columns-4 space-y-4 gap-4  w-full  mx-auto">
            {images.map((img, idx) => (
              <div
                key={img + idx}
                onClick={() => openModal(idx)}
                className="w-full mb-4 cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition relative"
                style={{
                  // background: "#232323",
                  display: "inline-block",
                  width: "100%",
                }}
              >
                <img
                  src={getImageUrl(img)}
                  alt={gallery.name}
                  className="hover:opacity-60"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "480px",
                    minHeight: "260px",
                    objectFit: "cover",
                    borderRadius: "1rem",
                    display: "block",
                  }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
        {selectedIndex !== null && gallery && (
          <div
            className="fixed inset-0 z-[9999] hero-overlay bg-opacity-0 flex items-center justify-center"
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
                {/* <IoIosArrowBack size={24} /> */}
                <svg
                  width="60"
                  height="48"
                  viewBox="0 0 60 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    {/* <!-- Three leftward dashes --> */}
                    <line
                      x1="51"
                      y1="24"
                      x2="43"
                      y2="24"
                      stroke="white"
                      stroke-width="3"
                      stroke-linecap="round"
                    />
                    <line
                      x1="39"
                      y1="24"
                      x2="31"
                      y2="24"
                      stroke="white"
                      stroke-width="3"
                      stroke-linecap="round"
                    />
                    <line
                      x1="27"
                      y1="24"
                      x2="19"
                      y2="24"
                      stroke="white"
                      stroke-width="3"
                      stroke-linecap="round"
                    />
                    {/* <!-- Left arrowhead --> */}
                    <polyline
                      points="13,16 3,24 13,32"
                      fill="none"
                      stroke="white"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                </svg>
              </button>
              <button
                onClick={showNext}
                className="fixed right-4 top-1/2 -translate-y-1/2 w-12 h-12 text-white hover:text-gray-300 z-[10000] cursor-pointer rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-200"
                aria-label="Next image"
              >
                {/* <IoIosArrowForward size={24} /> */}
                <svg
                  width="60"
                  height="48"
                  viewBox="0 0 60 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <line
                      x1="9"
                      y1="24"
                      x2="17"
                      y2="24"
                      stroke="white"
                      stroke-width="3"
                      stroke-linecap="round"
                    />
                    {/* <!-- Second dash --> */}
                    <line
                      x1="21"
                      y1="24"
                      x2="29"
                      y2="24"
                      stroke="white"
                      stroke-width="3"
                      stroke-linecap="round"
                    />
                    <line
                      x1="33"
                      y1="24"
                      x2="41"
                      y2="24"
                      stroke="white"
                      stroke-width="3"
                      stroke-linecap="round"
                    />
                    <polyline
                      points="47,16 57,24 47,32"
                      fill="none"
                      stroke="white"
                      stroke-width="4"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                </svg>
              </button>
              <button
                onClick={closeModal}
                className="fixed top-4 right-6 text-4xl text-white z-[10001] cursor-pointer"
                aria-label="Close"
              >
                <FiX />
              </button>
              <img
                src={getImageUrl(images[selectedIndex])}
                alt={gallery.name}
                className="w-full max-h-[calc(100vh-130px)] my-[30px] object-contain"
                style={{
                  borderRadius: "1rem",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
