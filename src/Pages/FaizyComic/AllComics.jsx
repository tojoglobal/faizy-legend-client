import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

const AllComics = () => {
  const instagramPosts = [
    {
      id: 1,
      image:
        "https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp",
      additionalImages: [
        "https://admin.ts-geosystems.com.bd/uploads/1747313731932-a.jpg",
        "https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp",
      ],
    },
    {
      id: 2,
      image: "https://admin.ts-geosystems.com.bd/uploads/1747313731932-a.jpg",
      additionalImages: [
        "https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp",
      ],
    },
    {
      id: 3,
      image:
        "https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp",
      additionalImages: [
        "https://admin.ts-geosystems.com.bd/uploads/1747313731932-a.jpg",
        "https://admin.ts-geosystems.com.bd/uploads/1748697396789-Apple-Watch-Series-10-top-banner-5841.webp",
        "https://admin.ts-geosystems.com.bd/uploads/1747313731932-a.jpg",
      ],
    },
  ];

  const [selectedPost, setSelectedPost] = useState(null);
  const modalRef = useRef();

  const openModal = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };
    if (selectedPost) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedPost]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instagramPosts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div
              className="relative cursor-pointer"
              onClick={() => openModal(post)}
            >
              <img
                src={post.image}
                alt="Instagram post"
                className="w-full h-56 object-cover"
              />
              {post.additionalImages.length > 0 && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-sm">
                  +{post.additionalImages.length}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedPost && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="w-full max-w-2xl bg-black rounded-md shadow-lg relative"
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-xl text-gray-600 hover:text-red-500"
            >
              &times;
            </button>

            {/* Main Swiper */}
            <Swiper
              spaceBetween={10}
              navigation={true}
              modules={[Navigation]}
              className="mb-4 swiper-custom-nav"
            >
              {/* Main image */}
              <SwiperSlide>
                <img
                  src={selectedPost.image}
                  alt="Main Comic"
                  className="w-full max-h-[60vh] object-contain mx-auto"
                />
              </SwiperSlide>
              {selectedPost.additionalImages.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={img}
                    alt={`Extra ${idx}`}
                    className="w-full max-h-[60vh] object-contain mx-auto"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllComics;
