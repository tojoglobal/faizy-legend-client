import "./modeling.css";
import ModelingCard from "./ModelingCard";
import { Link } from "react-router-dom";

// Card Data Example
const cards = [
  {
    img: "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/04/IMG_8828-scaled.jpg",
    title: "MOUNTAIN VIBES",
    meta: "Phoenix, Arizona | @Elivireichphoto",
  },
  {
    img: "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/04/IMG_8625-scaled.jpg",
    title: "LEOPARD IN STYLE",
    meta: "Houston, Texas | @Valentinoui",
  },
  {
    img: "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/04/IMG_86651-scaled.jpg",
    title: "SHADOWED SILENCE",
    meta: "Katy, Texas | @pdl_photography",
  },
  {
    img: "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/04/IMG_8724-scaled.jpg",
    title: "SUITED BUT SAVAGE",
    meta: "Houston, Texas | @skinmintclinent",
  },
  {
    img: "/gallery/raw-in-royal-blue.webp",
    title: "RAW IN ROYAL BLUE",
    meta: "Phoenix, Arizona | @Elivireichphoto",
  },
  {
    img: "/gallery/the-vintage-society.webp",
    title: "THE VINTAGE SOCIETY",
    meta: "Austin, Texas | @EccentricNanichi",
  },
  {
    img: "/gallery/divine-dangerous.webp",
    title: "DIVINE & DANGEROUS",
    meta: "Austin, Texas | @pdl_photography",
  },
  {
    img: "/gallery/ranch-royalty.webp",
    title: "RANCH ROYALTY",
    meta: "Woodlands, Texas | @KatlinCole",
  },
];

const ModelingGallery = () => {
  return (
    <div className="w-full pt-4 pb-8 px-2 md:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {cards.map((card) => (
          <Link
            to={`/gallery/${card?.title.replace(/\s+/g, "-").toLowerCase()}`}
            key={card?.title}
          >
            <ModelingCard
              img={card?.img}
              title={card?.title}
              meta={card?.meta}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ModelingGallery;
