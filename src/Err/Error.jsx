import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1a202c] text-white px-4">
      <div className="text-center">
        <h1 className="text-[120px] font-bold leading-none text-red-500">
          404
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-400 text-lg mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-full hover:scale-105 transition-transform duration-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
