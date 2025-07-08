import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

const AllComics = () => {
  // Instagram-style posts data (single image per post)
  const instagramPosts = [
    {
      id: 1,
      image:
        "https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp",
      additionalImages: [
        "https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp",
        "https://admin.ts-geosystems.com.bd/uploads/1747313731932-a.jpg",
        "https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp",
      ],
    },
    {
      id: 2,
      image: "https://admin.ts-geosystems.com.bd/uploads/1747313731932-a.jpg",
      additionalImages: [
        "https://admin.ts-geosystems.com.bd/uploads/1747313731932-a.jpg",
        "https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp",
      ],
    },
    {
      id: 3,
      image:
        "https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp",
      additionalImages: [
        "https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp",
        "https://admin.ts-geosystems.com.bd/uploads/1747313731932-a.jpg",
        "https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp",
        "https://admin.ts-geosystems.com.bd/uploads/1747313731932-a.jpg",
      ],
    },
    {
      id: 4,
      image: "https://admin.ts-geosystems.com.bd/uploads/1747313731932-a.jpg",
      additionalImages: [
        "https://admin.ts-geosystems.com.bd/uploads/1747313731932-a.jpg",
        "https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp",
      ],
    },
    {
      id: 5,
      image:
        "https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp",
      additionalImages: [
        "https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp",
        "https://admin.ts-geosystems.com.bd/uploads/1747313731932-a.jpg",
        "https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp",
      ],
    },
    {
      id: 6,
      image: "https://admin.ts-geosystems.com.bd/uploads/1747313731932-a.jpg",
      additionalImages: [
        "https://admin.ts-geosystems.com.bd/uploads/1747313731932-a.jpg",
        "https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp",
        "https://admin.ts-geosystems.com.bd/uploads/1747313731932-a.jpg",
      ],
    },
  ];

  // State for modal
  const [selectedPost, setSelectedPost] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const openModal = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setThumbsSwiper(null);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instagramPosts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {/* Single Image */}
            <div
              className="relative cursor-pointer"
              onClick={() => openModal(post)}
            >
              <img
                src={post.image}
                alt="Instagram post"
                className="w-full h-56 object-cover"
              />
              {/* Show indicator if there are additional images */}
              {post.additionalImages.length > 0 && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-sm">
                  +{post.additionalImages.length}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Post Details */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
          >
            &times;
          </button>

          <div className="w-full max-w-2xl">
            {/* Main Swiper */}
            <Swiper
              spaceBetween={10}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[Navigation, Thumbs, FreeMode]}
              className="mb-4"
            >
              {/* Main image */}
              <SwiperSlide>
                <img
                  src={selectedPost.image}
                  alt="Instagram post"
                  className="w-full max-h-[60vh] object-contain mx-auto"
                />
              </SwiperSlide>

              {/* Additional images */}
              {selectedPost.additionalImages.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={img}
                    alt={`Additional content ${idx + 1}`}
                    className="w-full max-h-[60vh] object-contain mx-auto"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Thumbnail Navigation */}
            {selectedPost.additionalImages.length > 0 && (
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mt-2"
              >
                {/* Main image thumbnail */}
                <SwiperSlide>
                  <img
                    src={selectedPost.image}
                    alt="Thumbnail"
                    className="w-full h-16 object-cover cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                  />
                </SwiperSlide>

                {/* Additional images thumbnails */}
                {selectedPost.additionalImages.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-16 object-cover cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllComics;
