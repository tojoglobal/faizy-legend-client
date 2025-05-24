import React from "react";
import { FaYoutube } from "react-icons/fa";

const VideoModal = ({ open, onClose, youtubeId, title, avatarUrl }) => {
  if (!open) return null;
  const videoUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-95">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-8 z-30 text-white text-4xl font-bold bg-black/50 rounded-full px-3 py-1 hover:bg-black/80 transition"
        aria-label="Close video"
      >
        ×
      </button>
      {/* Video */}
      <div className="w-full h-full shadow-2xl flex items-center justify-center cursor-pointer">
        <iframe
          width="85%"
          height="90%"
          src={videoUrl}
          title={title}
          allowFullScreen
          className="rounded-lg shadow-2xl bg-black"
          style={{
            minHeight: 400,
            minWidth: 600,
            maxHeight: "80vh",
            maxWidth: "90vw",
          }}
        ></iframe>
      </div>
      {/* Bottom "Watch on YouTube" bar */}
      <div className="absolute left-42 right-0 bottom-10 flex items-center  p-3 z-20">
        <a
          href={videoUrl.replace("/embed/", "/watch?v=")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex gap-3 items-center text-white text-base"
        >
          <span className="text-base">Watch on </span>
          <span className="flex justify-center gap-1">
            <FaYoutube className="text-2xl" />
            YouTube
          </span>
        </a>
      </div>
    </div>
  );
};

export default VideoModal;
