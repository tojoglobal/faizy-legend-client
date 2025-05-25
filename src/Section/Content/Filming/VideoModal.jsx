import { useEffect } from "react";
import { FiX } from "react-icons/fi";

const VideoModal = ({ open, onClose, youtubeId, title, avatarUrl }) => {
  useEffect(() => {
    if (open) {
      // Disable scrolling when modal opens
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling when modal closes
      document.body.style.overflow = "auto";
    }

    // Cleanup function to re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2147483647] bg-black/90 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[2147483648] p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
      >
        <FiX size={24} />
      </button>

      {/* Video Container */}
      <div className="relative w-full max-w-4xl aspect-video mx-4">
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
