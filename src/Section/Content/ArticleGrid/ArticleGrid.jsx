import React from "react";

// Example dynamic data for articles
const articles = [
  {
    id: 1,
    title: "Through the Lens",
    imageUrl:
      "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/01/through-the-lens.png", // Replace with actual image paths
    articleUrl: "/article/through-the-lens",
  },
  {
    id: 2,
    title: "VIT Life",
    imageUrl:
      "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/01/vit-life-e1737832051742.png",
    articleUrl: "/article/vit-life",
  },
  {
    id: 3,
    title: "Inkl",
    imageUrl:
      "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/01/inkl.png",
    articleUrl: "/article/inkl",
  },
  {
    id: 4,
    title: "Fashion Forward",
    imageUrl:
      "https://aliceblue-rhinoceros-454708.hostingersite.com/wp-content/uploads/2025/01/through-the-lens.png",
    articleUrl: "/article/fashion-forward",
  },
  // Add more articles as needed
];

const ArticleGrid = () => (
  <section className="w-full py-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {articles.map((article) => (
        <a
          key={article?.id}
          href={article?.articleUrl}
          className="group relative block rounded-xl overflow-hidden"
        >
          <img
            src={article?.imageUrl}
            alt={article?.title}
            className="w-full h-fit object-cover transition-opacity duration-300 group-hover:opacity-40"
            draggable={false}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
            <span className="text-white font-poppins font-normal text-lg md:text-2xl text-center drop-shadow-lg">
              {article?.title}
            </span>
            <span className="mt-2 text-sm font-poppins font-normal md:text-base text-white  bg-opacity-50 px-3 py-1 rounded-full ">
              views
            </span>
          </div>
        </a>
      ))}
    </div>
  </section>
);

export default ArticleGrid;
