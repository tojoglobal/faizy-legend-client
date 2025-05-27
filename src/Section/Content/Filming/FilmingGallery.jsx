import { useState, useEffect } from "react";
import VideoModal from "./VideoModal";
import FilmingCard from "./FilmingCard";
import axios from "axios";

export default function FilmingGallery() {
  const [openVideo, setOpenVideo] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFilmingVideos = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/filming");
        setCards(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch filming videos");
      } finally {
        setLoading(false);
      }
    };

    fetchFilmingVideos();
  }, []);

  const selectedCard = cards.find((card) => card.youtube_id === openVideo);

  if (loading) return <div className="text-center py-8">Loading videos...</div>;
  if (error) {
    console.log(error);
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 px-4">
      <VideoModal
        open={!!openVideo}
        onClose={() => setOpenVideo(null)}
        youtubeId={selectedCard?.youtube_id}
        title={selectedCard?.title}
      />

      {cards.map((card) => (
        <FilmingCard
          key={card.id}
          img={card.image_url}
          title={card.title}
          onPlay={() => setOpenVideo(card.youtube_id)}
        />
      ))}
    </div>
  );
}
