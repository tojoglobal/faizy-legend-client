/* eslint-disable react-refresh/only-export-components */
import "./modeling.css";
import ModelingCard from "./ModelingCard";
import { Link } from "react-router-dom";

export const modelingCards = [
  {
    img: "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/04/IMG_8828-scaled.jpg",
    title: "MOUNTAIN VIBES",
    meta: "Phoenix, Arizona | @Elivireichphoto",
    type: "mountain-vibes",
    photographer: "@Elivireichphoto",
  },
  {
    img: "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/04/IMG_8625-scaled.jpg",
    title: "LEOPARD IN STYLE",
    meta: "Houston, Texas | @Valentinoui",
    type: "leopard-in-style",
    photographer: "@Valentinoui",
  },
  {
    img: "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/04/IMG_86651-scaled.jpg",
    title: "SHADOWED SILENCE",
    meta: "Katy, Texas | @pdl_photography",
    type: "shadowed-silence",
    photographer: "@pdl_photography",
  },
  {
    img: "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/04/IMG_8724-scaled.jpg",
    title: "SUITED BUT SAVAGE",
    meta: "Houston, Texas | @skinmintclinent",
    type: "suited-but-savage",
    photographer: "@skinmintclinent",
  },
];

const ModelingGallery = () => {
  return (
    <div className="w-full pt-4 pb-8 px-2 md:px-8 relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {selectedImage && (
  <div
    className="fixed inset-0 z-[9999] bg-black bg-opacity-80 flex items-center justify-center"
    onClick={handleClose}
  >
    <div
      className="relative w-full h-full flex items-center justify-center"
      onClick={e => e.stopPropagation()}
    >
      <img
        src={selectedImage.img}
        alt=""
        className="object-contain"
        style={{
          width: "100vw",
          height: "calc(100vh - 40px)",
          marginTop: "20px",
          marginBottom: "20px"
        }}
      />
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default ModelingGallery;
