import { useState } from "react";
import ShoppingCard from "./ShoppingCard";

const products = [
  {
    id: 1,
    name: "Faizy Comic",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIMdbyTDzP2wEubL1tF5zaNUqPugO_TkzUdQ&s",
    category: "Shirts",
    link: "/product/faizy-comic",
  },
  {
    id: 2,
    name: "Simple Design",
    image: "/shirts/simple-design.png",
    category: "Shirts",
    link: "/product/simple-design",
  },
  {
    id: 3,
    name: "Vitiligo Crown",
    image: "/shirts/vitiligo-crown.png",
    category: "Shirts",
    link: "/product/vitiligo-crown",
  },
  {
    id: 4,
    name: "Wolf Design",
    image: "/shirts/wolf-design.png",
    category: "Shirts",
    link: "/product/wolf-design",
  },
  {
    id: 5,
    name: "Faizy Comic",
    image: "/shirts/faizy-comic.png",
    category: "Shirts",
    link: "/product/faizy-comic",
  },
  {
    id: 6,
    name: "Simple Design",
    image: "/shirts/simple-design.png",
    category: "Shirts",
    link: "/product/simple-design",
  },
  {
    id: 7,
    name: "Vitiligo Crown",
    image: "/shirts/vitiligo-crown.png",
    category: "Shirts",
    link: "/product/vitiligo-crown",
  },
  {
    id: 8,
    name: "Wolf Design",
    image: "/shirts/wolf-design.png",
    category: "Shirts",
    link: "/product/wolf-design",
  },
];

const categories = ["Category Filter", "Shirts"];

const Shopping = () => {
  const [selectedCategory, setSelectedCategory] = useState("Category Filter");

  const filteredProducts =
    selectedCategory === "Category Filter"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="">
      {/* Category Filter */}
      <div className="mb-8 relative w-48">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-1 text-white appearance-none cursor-pointer focus:outline-none focus:bg-[#191919] bg-[#191919] border-b border-white"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M7 10l5 5 5-5H7z" />
          </svg>
        </div>
      </div>
      {/* Product Grid */}
      <ShoppingCard filteredProducts={filteredProducts} />
    </div>
  );
};

export default Shopping;
