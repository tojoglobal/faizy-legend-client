import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import FilmingCard from "./FilmingCard";
import { useEffect } from "react";
import { useAppContext } from "./../../../context/useAppContext";

export default function FilmingGallery() {
  const { apiUrl, openVideo, setOpenVideo, setSelectedCard } = useAppContext();

  const {
    data: cards = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["filming-gallery"],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/api/filming`);
      return res?.data;
    },
  });

  // ✅ Update selectedCard in context when openVideo changes
  useEffect(() => {
    if (openVideo && cards.length > 0) {
      const foundCard = cards.find((card) => card.youtube_id === openVideo);
      setSelectedCard(foundCard || null);
    } else {
      setSelectedCard(null);
    }
  }, [openVideo, cards, setSelectedCard]);

  if (isLoading)
    return <div className="text-center py-8">Loading videos...</div>;
  if (isError)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <>
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {cards.map((card) => (
          <FilmingCard
            key={card.id}
            youtube_id={card.youtube_id}
            title={card.title}
            onPlay={() => setOpenVideo(card.youtube_id)}
          />
        ))}
      </div>
    </>
  );
}
