import { Link } from "react-router-dom";

const ShoppingCard = ({ filteredProducts }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-4">
      {filteredProducts.map((product) => (
        <Link
          to={product.link}
          key={product.id}
          className="relative bg-[#3d3d3d] aspect-square overflow-hidden group rounded-lg"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 group-hover:hero-overlay group-hover:bg-opacity-10 transition-opacity duration-300 flex items-center justify-center">
            <h3 className="text-xl hidden group-hover:block font-semibold text-gray-300 text-center">
              {product.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ShoppingCard;
