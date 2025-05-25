import { useEffect } from "react";
import { FiX } from "react-icons/fi";

const VideoModal = ({ open, onClose, youtubeId, title, avatarUrl }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (e) => {
    // Close modal if clicked directly on the backdrop
    if (e.target.id === "video-backdrop") {
      onClose();
    }
  };

  return (
    <div
      id="video-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[2147483647] bg-black/90 flex items-center justify-center"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[2147483648] p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
      >
        <FiX size={24} />
      </button>

      {/* Video Container */}
      <div
        className="relative w-full max-w-4xl aspect-video mx-4"
        onClick={(e) => e.stopPropagation()} // Prevents modal close on click inside video
      >
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default VideoModal;
