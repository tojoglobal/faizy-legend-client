import { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { CiPlay1 } from "react-icons/ci";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const AdBanner = () => {
  useEffect(() => {
    if (window.location.hostname !== "localhost") {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("Adsense error", e);
      }
    }
  }, []);

  return (
    <ins
      className="adsbygoogle block rounded"
      style={{ display: "block", width: "100%", height: "190px" }}
      data-ad-client="ca-pub-3713767832812238"
      data-ad-slot="PUT_AD_SLOT_ID_HERE"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

const FaizyComic = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const swiperRef = useRef(null);

  const images = [
    "https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp",
    "https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp",
    "https://admin.ts-geosystems.com.bd/uploads/1747313731932-a.jpg",
    "https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp",
    "https://admin.ts-geosystems.com.bd/uploads/1747313731932-a.jpg",
  ];

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const onSlideChange = (swiper) => {
    setCurrentPage(swiper.realIndex + 1);
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
        <div>
          <AdBanner />
        </div>
        {/* Swiper Slider */}
        <div className="w-full mt-6">
          <Swiper
            ref={swiperRef}
            slidesPerView={1.5}
            spaceBetween={12}
            loop={false}
            modules={[Navigation]}
            className="mySwiper"
            onSlideChange={onSlideChange}
            breakpoints={{
              640: {
                slidesPerView: 1.5,
                spaceBetween: 12,
              },
              768: {
                slidesPerView: 1.5,
                spaceBetween: 12,
              },
              1024: {
                slidesPerView: 1.5,
                spaceBetween: 12,
              },
            }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`Comic ${index + 1}`}
                  className="w-full md:h-64 lg:h-44 object-cover rounded-md"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* Pagination */}
        <div className="col-span-1 md:col-span-2 mt-5 flex items-center gap-4">
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
