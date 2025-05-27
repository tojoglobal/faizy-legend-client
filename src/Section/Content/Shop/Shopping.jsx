import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ShoppingCard from "./ShoppingCard";
import axios from "axios";

const API = import.meta.env.VITE_OPEN_APIURL;

// Utility to get absolute image url
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  if (/^https?:\/\//.test(imageUrl)) return imageUrl;
  return `${API.replace(/\/$/, "")}${imageUrl}`;
};

export default function Shopping() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["shop-products"],
    queryFn: async () => {
      const res = await axios.get(`${API}/api/shopping/products`);
      return res.data;
    },
  });

  const { data: categories = [], isLoading: catLoading } = useQuery({
    queryKey: ["shop-categories"],
    queryFn: async () => {
      const res = await axios.get(`${API}/api/shopping/categories`);
      return res.data;
    },
  });

  // Build filter options (prepend "All" option)
  const categoryOptions = ["All", ...categories.map((c) => c.name)];

  const [selectedCategory, setSelectedCategory] = useState("All");

  // Map products with absolute image URLs
  const mappedProducts = products.map((p) => ({
    ...p,
    image: getImageUrl(p.image_url),
    category: p.category_name,
    link: p.link,
  }));

  const filteredProducts =
    selectedCategory === "All"
      ? mappedProducts
      : mappedProducts.filter(
          (product) => product.category === selectedCategory
        );

  return (
    <div>
      {/* Category Filter */}
      <div className="mb-8 relative w-48">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-1 text-white appearance-none cursor-pointer focus:outline-none focus:bg-[#191919] bg-[#191919] border-b border-white"
        >
          {categoryOptions.map((category) => (
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
      {isLoading || catLoading ? (
        <div className="text-gray-300 py-8 text-center">Loading...</div>
      ) : (
        <ShoppingCard filteredProducts={filteredProducts} />
      )}
    </div>
  );
}
