import { BsPlayCircle } from "react-icons/bs";

const FilmingCard = ({ img, title, onPlay }) => (
  <div>
    <div className="relative group rounded-lg overflow-hidden cursor-pointer">
      <img
        src={img}
        alt={title}
        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {/* Play button overlay */}
      <button
        onClick={onPlay}
        className="absolute inset-0 flex items-center justify-center text-5xl text-white  transition-transform duration-500 group-hover:scale-100"
        aria-label={`Play trailer for ${title}`}
      >
        <BsPlayCircle />
      </button>
    </div>
    <div className="mt-2 text-center text-white font-bold text-lg">{title}</div>
  </div>
);

export default FilmingCard;
