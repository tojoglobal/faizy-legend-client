import React, { useState } from "react";
import VideoModal from "./VideoModal";
import FilmingCard from "./FilmingCard";

const cards = [
  {
    img: "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/01/IMG_4755.jpg",
    title: "SILENT DRAGON FORCE",
    youtubeId: "ZaCr1rsmW1Q",
  },
  {
    img: "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/02/Screen-Shot-2025-02-05-at-4.36.58-PM-2048x934.png",
    title: "HUMAN AND DEMON REALM",
    youtubeId: "YOUTUBE_ID2",
  },
  {
    img: "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/01/IMG_4755.jpg",
    title: "SILENT DRAGON FORCE",
    youtubeId: "YOUTUBE_ID1",
  },
  {
    img: "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/02/Screen-Shot-2025-02-05-at-4.36.58-PM-2048x934.png",
    title: "HUMAN AND DEMON REALM",
    youtubeId: "YOUTUBE_ID2",
  },
];

export default function FilmingGallery() {
  const [openVideo, setOpenVideo] = useState(null);

  // Find the card that matches the openVideo youtubeId
  const selectedCard = cards.find((card) => card.youtubeId === openVideo);

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
      <VideoModal
        open={!!openVideo}
        onClose={() => setOpenVideo(null)}
        youtubeId={selectedCard?.youtubeId}
        title={selectedCard?.title}
        avatarUrl={selectedCard?.img}
      />

      {cards.map((card, i) => (
        <FilmingCard
          key={i + card.youtubeId}
          img={card.img}
          title={card.title}
          onPlay={() => setOpenVideo(card.youtubeId)}
        />
      ))}
    </div>
  );
}
