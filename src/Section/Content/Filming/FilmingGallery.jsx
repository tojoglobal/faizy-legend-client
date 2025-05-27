import { useState } from "react";
import VideoModal from "./VideoModal";
import FilmingCard from "./FilmingCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function FilmingGallery() {
  const [openVideo, setOpenVideo] = useState(null);

  const {
    data: cards = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_OPEN_APIURL}/api/filming`
      );
      return res?.data;
    },
  });
  const selectedCard = cards?.find((card) => card.youtube_id === openVideo);

  if (isLoading)
    return <div className="text-center py-8">Loading videos...</div>;
  if (isError) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
      <VideoModal
        open={!!openVideo}
        onClose={() => setOpenVideo(null)}
        youtubeId={selectedCard?.youtube_id}
      />
      {cards.map((card) => (
        <FilmingCard
          key={card.id}
          youtube_id={card.youtube_id}
          title={card.title}
          onPlay={() => setOpenVideo(card.youtube_id)}
        />
      ))}
    </div>
  );
}
