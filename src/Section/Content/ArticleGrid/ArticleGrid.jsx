import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API = import.meta.env.VITE_OPEN_APIURL;

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  if (/^https?:\/\//.test(imageUrl)) return imageUrl;
  return `${API.replace(/\/$/, "")}${imageUrl}`;
};

const ArticleGrid = () => {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const res = await axios.get(`${API}/api/articles`);
      return res.data;
    },
  });

  return (
    <section className="w-full py-4  sm:px-4 md:px-8  mx-auto">
      {isLoading ? (
        <div className="text-center text-white py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article) => (
            <a
              key={article.id}
              href={article.link}
              className="group relative block rounded-xl overflow-hidden shadow-md transition-transform duration-200 hover:scale-[1.02] bg-[#232323]"
            >
              <div className="aspect-w-16 aspect-h-10 w-full">
                <img
                  src={getImageUrl(article.image_url)}
                  alt={article.title}
                  className="w-full h-full object-cover object-center transition-opacity duration-300 group-hover:opacity-40"
                  draggable={false}
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-black/30">
                <span className="text-white font-poppins font-semibold text-base sm:text-lg md:text-2xl text-center drop-shadow-lg px-2">
                  {article.title}
                </span>
                <span className="mt-2 text-xs sm:text-sm md:text-base font-poppins font-normal text-white bg-black/60 px-3 py-1 rounded-full">
                  views
                </span>
              </div>
            </a>
          ))}
          {articles.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-8">
              No articles found.
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ArticleGrid;
