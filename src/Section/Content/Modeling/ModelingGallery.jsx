import { useQuery } from "@tanstack/react-query";
import "./modeling.css";
import { Link } from "react-router-dom";
import axios from "axios";
import ModelingCard from "./ModelingCard";

const API_URL = `${import.meta.env.VITE_OPEN_APIURL}/api/modeling-gallery`;

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

const ModelingGallery = () => {
  const {
    data: modelingData = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["modeling-gallery"],
    queryFn: async () => {
      const res = await axios.get(API_URL);
      return res.data;
    },
  });

  return (
    <div className="w-full pt-4 pb-8 px-2 md:px-8 relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {isLoading ? (
          <div className="col-span-full text-center text-gray-400 py-12">
            Loading...
          </div>
        ) : isError ? (
          <div className="col-span-full text-center text-red-400 py-12">
            {error?.message || "Error loading galleries"}
          </div>
        ) : modelingData.length > 0 ? (
          modelingData.map((card, index) => (
            <Link
              key={card.name + index}
              to={`/gallery/${slugify(card.name)}`}
              className="cursor-pointer"
              style={{ textDecoration: "none" }}
            >
              <ModelingCard
                img={card?.thumbnail}
                title={card?.name}
                location={card?.location}
                photographer={card?.photographer}
              />
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-12">
            No modeling galleries found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelingGallery;
