import { useEffect } from "react";
import { FaYoutube } from "react-icons/fa";
import { FiX } from "react-icons/fi";

const VideoModal = ({ open, onClose, youtubeId, title }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  // Close on click outside video area
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const videoUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&&modestbranding=1&controls=0`;

  const watchUrl = `https://www.youtube.com/watch?v=${youtubeId}`;

  return (
    <div
      className="fixed inset-0 z-[99999] hero-overlay bg-opacity-0 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-6 z-20 p-2 bg-black/60 rounded-full text-white hover:bg-white/20 transition-colors"
        aria-label="Close video"
        type="button"
      >
        <FiX size={32} />
      </button>
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center relative px-2 sm:px-6">
        {/* Video Player */}
        <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-700 flex items-center justify-center">
          <iframe
            src={videoUrl}
            title={title}
            allowFullScreen
            className="w-full h-full"
            frameBorder="0"
          />
        </div>
        {/* Watch on YouTube (responsive, bottom center) */}
        <div className="w-full flex justify-start">
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 items-center text-white bg-black bg-opacity-60 rounded-lg px-4 py-2 text-base hover:bg-opacity-80 transition"
          >
            <span className="text-base">Watch on</span>
            <span className="flex items-center gap-1">
              <FaYoutube className="text-2xl" />
              YouTube
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
