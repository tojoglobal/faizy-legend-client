import "./ugc.css";
import YoutubeShortsMockup from "./YoutubeShortsMockup";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// API URL from environment variable
const API_URL = `${import.meta.env.VITE_OPEN_APIURL}/api/ugc`;

// Convert YouTube/Shorts/etc URLs to embed format for iframe
const convertToEmbedUrl = (url) => {
  const base = "https://www.youtube.com/embed/";
  if (url.includes("/embed/")) {
    return `${url}?rel=0&modestbranding=1&playsinline=1`;
  }
  if (url.includes("/shorts/")) {
    const videoId = url.split("/shorts/")[1].split("?")[0];
    return `${base}${videoId}?rel=0&modestbranding=1&playsinline=1`;
  }
  // fallback: try to extract the video ID from standard youtube URL
  const match = url.match(
    /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/
  );
  if (match) {
    return `${base}${match[1]}?rel=0&modestbranding=1&playsinline=1`;
  }
  return url;
};

const Ugc = () => {
  const {
    data: videos = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ugc-videos"],
    queryFn: async () => {
      const res = await axios.get(API_URL);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="py-8 text-center text-gray-300">
        Loading UGC videos...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8 text-center text-red-400">
        Error loading videos: {error?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="py-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
        {videos?.map((video) => (
          <YoutubeShortsMockup
            key={video.id}
            videoUrl={convertToEmbedUrl(video.url)}
            title={video.title}
          />
        ))}
      </div>
    </div>
  );
};

export default Ugc;
