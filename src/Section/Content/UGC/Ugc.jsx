import "./ugc.css";
import YoutubeShortsMockup from "./YoutubeShortsMockup";

const rawVideoData = [
  { url: "https://www.youtube.com/embed/Q8TXgCzxEnw", title: "GLASSES 1" },
  { url: "https://www.youtube.com/embed/gz60zMDbRKk", title: "GLASSES 3" },
  { url: "https://www.youtube.com/embed/dQw4w9WgXcQ", title: "GLASSES 4" },
  { url: "https://www.youtube.com/shorts/Xpu6YE1ivAI", title: "GLASSES 5" },
];

// Normalize Shorts URLs to embed format
const convertToEmbedUrl = (url) => {
  const base = "https://www.youtube.com/embed/";
  if (url.includes("/embed/"))
    return `${url}?rel=0&modestbranding=1&playsinline=1`;
  if (url.includes("/shorts/")) {
    const videoId = url.split("/shorts/")[1].split("?")[0];
    return `${base}${videoId}?rel=0&modestbranding=1&playsinline=1`;
  }
  return url;
};

// Final video array with embed URL and title
const videoData = rawVideoData.map((item) => ({
  videoUrl: convertToEmbedUrl(item.url),
  title: item.title,
}));

const Ugc = () => {
  return (
    <div className="py-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
        {videoData.map((video, index) => (
          <YoutubeShortsMockup
            key={index}
            videoUrl={video.videoUrl}
            title={video.title}
          />
        ))}
      </div>
    </div>
  );
};

export default Ugc;
