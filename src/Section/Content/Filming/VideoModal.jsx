import { useEffect } from "react";
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-5xl mx-auto">
        <button
          onClick={onClose}
          className="absolute top-1 right-0 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-white/20 transition-colors"
          aria-label="Close video"
        >
          <FiX size={24} />
        </button>
        <div className="w-full aspect-video rounded-lg overflow-hidden shadow-xl bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            frameBorder="0"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
