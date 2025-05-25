import "./modeling.css";
import ModelingCard from "./ModelingCard";
import { useState, useEffect, useCallback } from "react";
import { FiX } from "react-icons/fi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Card Data Example
const cards = [
  {
    img: "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/04/IMG_8828-scaled.jpg",
    title: "MOUNTAIN VIBES",
    meta: "Phoenix, Arizona | @Elivireichphoto",
  },
  {
    img: "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/04/IMG_8625-scaled.jpg",
    title: "LEOPARD IN STYLE",
    meta: "Houston, Texas | @Valentinoui",
  },
  {
    img: "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/04/IMG_86651-scaled.jpg",
    title: "SHADOWED SILENCE",
    meta: "Katy, Texas | @pdl_photography",
  },
  {
    img: "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/04/IMG_8724-scaled.jpg",
    title: "SUITED BUT SAVAGE",
    meta: "Houston, Texas | @skinmintclinent",
  },
  {
    img: "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/04/IMG_8828-scaled.jpg",
    title: "MOUNTAIN VIBES",
    meta: "Phoenix, Arizona | @Elivireichphoto",
  },
  {
    img: "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/04/IMG_8625-scaled.jpg",
    title: "LEOPARD IN STYLE",
    meta: "Houston, Texas | @Valentinoui",
  },
  {
    img: "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/04/IMG_86651-scaled.jpg",
    title: "SHADOWED SILENCE",
    meta: "Katy, Texas | @pdl_photography",
  },
  {
    img: "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/04/IMG_8724-scaled.jpg",
    title: "SUITED BUT SAVAGE",
    meta: "Houston, Texas | @skinmintclinent",
  },
];

const ModelingGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageClick = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    document.body.style.overflow = "hidden";
  };

  const handleClose = useCallback(() => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  }, []);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;

      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, currentIndex, handleClose]);

  const handlePrevious = (e) => {
    if (e) e.stopPropagation();
    const newIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(cards[newIndex]);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    const newIndex = (currentIndex + 1) % cards.length;
    setCurrentIndex(newIndex);
    setSelectedImage(cards[newIndex]);
  };

  return (
    <div className="w-full pt-4 pb-8 px-2 md:px-8 relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {cards.map((card, index) => (
          <div
            key={card.title}
            onClick={() => handleImageClick(card, index)}
            className="cursor-pointer"
          >
            <ModelingCard img={card.img} title={card.title} meta={card.meta} />
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-200/20 z-[9999] flex items-center justify-center"
          onClick={handleClose}
        >
          {/* This container stops propagation to prevent closing when clicking inside */}
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="fixed top-4 right-4 w-12 h-12 text-white hover:text-gray-300 z-[10000] rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-200"
              aria-label="Close preview"
            >
              <FiX size={24} />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={handlePrevious}
              className="fixed left-4 top-1/2 -translate-y-1/2 w-12 h-12 text-white hover:text-gray-300 z-[10000] rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-200"
              aria-label="Previous image"
            >
              <IoIosArrowBack size={24} />
            </button>

            <button
              onClick={handleNext}
              className="fixed right-4 top-1/2 -translate-y-1/2 w-12 h-12 text-white hover:text-gray-300 z-[10000] rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-200"
              aria-label="Next image"
            >
              <IoIosArrowForward size={24} />
            </button>

            {/* Image */}
            <img
              src={selectedImage.img}
              alt={selectedImage.title}
              className="max-w-md h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelingGallery;