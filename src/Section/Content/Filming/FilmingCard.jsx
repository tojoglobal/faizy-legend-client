import { BsPlayCircle } from "react-icons/bs";

const getThumbnail = (youtube_id) =>
  `https://img.youtube.com/vi/${youtube_id}/hqdefault.jpg`;

const FilmingCard = ({ img, youtube_id, title, onPlay }) => {
  const src = youtube_id ? getThumbnail(youtube_id) : img;
  return (
    <div className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
      <div className="relative group rounded-md overflow-hidden shadow-md">
        <img
          src={src}
          alt={title}
          className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-100 transition-opacity duration-300">
          <button
            onClick={onPlay}
            className="absolute inset-0 cursor-pointer flex items-center justify-center text-5xl text-white transition-all duration-300"
            aria-label={`Play trailer for ${title}`}
          >
            <BsPlayCircle className="drop-shadow-lg" />
          </button>
        </div>
      </div>
      <div className="mt-2 mx-2 md:mx-0 uppercase text-white font-bold text-lg">
        {title}
      </div>
    </div>
  );
};

export default FilmingCard;
