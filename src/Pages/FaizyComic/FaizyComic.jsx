import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { CiPlay1 } from "react-icons/ci";

const FaizyComic = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
      {/* Left Section */}
      <div className="w-full lg:w-1/2">
        <p className="text-sm text-lime-400 mb-2">What’s New Today?</p>
        <h2 className="text-5xl font-bold mb-4 roboto-condensed">
          Making It Up To You
        </h2>
        <p className="text-gray-300 mb-6">
          Denji has a simple dream—to live a happy and peaceful life, spending
          time with a girl he likes. This is a far cry from reality, however, as
          Denji is forced by the yakuza into killing devils in order to pay off
          his crushing debts. Using his pet devil Pochita as a...
        </p>
        <div className="flex gap-2">
          <a
            href="https://www.instagram.com/faizycomic"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-md text-white text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <CiPlay1 /> Follow
          </a>
          <button className="border border-lime-400 px-4 py-2 rounded-md text-sm hover:bg-lime-500 hover:text-black">
            Read More
          </button>
        </div>
      </div>
      <div className="w-full lg:w-1/2">
        {/* Right Section */}
        <div className="space-y-4">
          <img
            src="https://admin.ts-geosystems.com.bd/uploads/1747313731932-a.jpg"
            alt="Ad Banner"
            className="w-full h-52 object-cover rounded"
          />
        </div>
        <div className="w-full mt-4 grid grid-cols-2 gap-3">
          <img
            src="https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp"
            alt="Comic 1"
            className="w-full h-36 object-cover rounded-md"
          />
          <img
            src="https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp"
            alt="Comic 2"
            className="w-full h-36 object-cover rounded-md"
          />
        </div>

        {/* Pagination */}
        <div className="col-span-1 md:col-span-2 mt-10 flex items-center gap-4">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="p-7 cursor-pointer border border-gray-400 rounded-full hover:bg-gray-700"
          >
            <FaArrowLeft size={10} />
          </button>
          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="p-7 cursor-pointer border border-gray-400 rounded-full hover:bg-gray-700"
          >
            <FaArrowRight size={10} />
          </button>
          {/* Line Separator */}
          <div className="flex-grow h-px bg-gray-400 opacity-50"></div>
          {/* Page Number */}
          <span className="text-xl text-lime-300 font-semibold roboto-condensed">
            {currentPage.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FaizyComic;
