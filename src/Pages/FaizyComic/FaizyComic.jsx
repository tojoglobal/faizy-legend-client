import { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaSpinner } from "react-icons/fa";
import { CiPlay1 } from "react-icons/ci";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

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
      data-ad-slot="9448608399"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

const FaizyComic = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const swiperRef = useRef(null);
  const axiosPublic = useAxiospublic();

  const { data: comic = {}, isLoading } = useQuery({
    queryKey: ["faizy-comics"],
    queryFn: async () => {
      const res = await axiosPublic.get("/api/faizy-comic");
      return res.data?.[0];
    },
  });

  const handleNext = () => swiperRef.current?.swiper?.slideNext();
  const handlePrev = () => swiperRef.current?.swiper?.slidePrev();

  const onSlideChange = (swiper) => {
    setCurrentPage(swiper.realIndex + 1);
  };

  if (isLoading || !comic){
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }
   
  const images = JSON.parse(comic.images || "[]");

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
      {/* Left Section */}
      <div className="w-full lg:w-1/2">
        <p className="text-sm text-lime-400 mb-2">{comic?.subtitle}</p>
        <h2 className="text-5xl font-bold mb-4 roboto-condensed">
          {comic?.title}
        </h2>
        <p className="text-gray-300 mb-6">
          {comic?.description?.length > 200 && !showFullDescription
            ? `${comic.description.slice(0, 200)}...`
            : comic.description}
        </p>
        <div className="flex gap-2">
          <a
            href={comic?.follow_url}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-md text-white text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <CiPlay1 /> Follow
          </a>
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="border cursor-pointer border-lime-400 px-4 py-2 rounded-md text-sm hover:bg-lime-500 hover:text-black"
          >
            {showFullDescription ? "Show Less" : "Read More"}
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2">
        <AdBanner />

        {/* Swiper Slider */}
        <div className="w-full mt-6">
          <Swiper
            ref={swiperRef}
            slidesPerView={1.5}
            spaceBetween={12}
            loop={false}
            modules={[Navigation]}
            onSlideChange={onSlideChange}
            className="mySwiper"
            breakpoints={{
              640: { slidesPerView: 1.5, spaceBetween: 12 },
              768: { slidesPerView: 1.5, spaceBetween: 12 },
              1024: { slidesPerView: 1.5, spaceBetween: 12 },
            }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={`${import.meta.env.VITE_OPEN_APIURL}${image}`}
                  alt={`Comic ${index + 1}`}
                  className="w-full h-56 md:h-72 lg:h-56 rounded-md"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Pagination */}
        <div className="mt-5 flex items-center gap-4">
          <button
            onClick={handlePrev}
            className="p-7 cursor-pointer border border-gray-400 rounded-full hover:bg-gray-700"
          >
            <FaArrowLeft size={10} />
          </button>
          <button
            onClick={handleNext}
            className="p-7 cursor-pointer border border-gray-400 rounded-full hover:bg-gray-700"
          >
            <FaArrowRight size={10} />
          </button>
          <div className="flex-grow h-px bg-gray-400 opacity-50"></div>
          <span className="text-xl text-lime-300 font-semibold roboto-condensed">
            {currentPage.toString().padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FaizyComic;
