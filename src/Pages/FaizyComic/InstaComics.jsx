import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAxiospublic } from "../../Hooks/useAxiospublic";
import { FaSpinner } from "react-icons/fa";
import ReactPlayer from "react-player";

const InstaComics = () => {
  const axiosPublic = useAxiospublic();
  const [selectedPost, setSelectedPost] = useState(null);
  const modalRef = useRef();

  // Function to check if a URL points to a video file
  const isVideoFile = (url) => {
    if (!url) return false;
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  // Fetch comics using TanStack Query
  const {
    data: instagramPosts = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ig-comics"],
    queryFn: async () => {
      const { data } = await axiosPublic.get("/api/admin/ig-comics");
      return data.map((comic) => ({
        id: comic.id,
        image: `${import.meta.env.VITE_OPEN_APIURL}/uploads/${
          JSON.parse(comic.images || "[]")[0]
        }`,
        additionalImages: JSON.parse(comic.images || "[]")
          .slice(1)
          .map((img) => `${import.meta.env.VITE_OPEN_APIURL}/uploads/${img}`),
      }));
    },
  });

  const openModal = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load Instagram comics. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between px-4 py-1 md:py-4">
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
              {isVideoFile(post.image) ? (
                <div className="w-full h-56 flex items-center justify-center bg-black">
                  <ReactPlayer
                    url={post.image}
                    width="100%"
                    height="100%"
                    controls={false}
                    light={true}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : (
                <img
                  src={post.image}
                  alt="Instagram post"
                  className="w-full h-56 object-cover"
                  loading="lazy"
                />
              )}
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
            className="w-full max-w-3xl 2xl:max-w-4xl bg-black rounded-md shadow-lg relative"
          >
            <button
              onClick={closeModal}
              className="absolute top-0 cursor-pointer right-2 text-xl text-gray-600 hover:text-red-500 z-10"
            >
              &times;
            </button>

            {/* Swiper with custom small arrows */}
            <Swiper
              spaceBetween={10}
              navigation={{
                nextEl: ".custom-next",
                prevEl: ".custom-prev",
              }}
              modules={[Navigation]}
              className="mb-4 relative"
            >
              <SwiperSlide>
                {isVideoFile(selectedPost.image) ? (
                  <div className="w-full h-[65vh] flex items-center justify-center">
                    <ReactPlayer
                      url={selectedPost.image}
                      width="100%"
                      height="100%"
                      controls={true}
                      style={{ maxHeight: "65vh" }}
                    />
                  </div>
                ) : (
                  <img
                    src={selectedPost.image}
                    alt="Main Comic"
                    className="w-full max-h-[65vh] object-contain mx-auto"
                  />
                )}
              </SwiperSlide>
              {selectedPost.additionalImages.map((img, idx) => (
                <SwiperSlide key={idx}>
                  {isVideoFile(img) ? (
                    <div className="w-full h-[65vh] flex items-center justify-center">
                      <ReactPlayer
                        url={img}
                        width="100%"
                        height="100%"
                        controls={true}
                        style={{ maxHeight: "65vh" }}
                      />
                    </div>
                  ) : (
                    <img
                      src={img}
                      alt={`Extra ${idx}`}
                      className="w-full max-h-[65vh] object-contain mx-auto"
                    />
                  )}
                </SwiperSlide>
              ))}

              {/* Small custom nav arrows */}
              <div className="custom-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 rounded-full p-2 cursor-pointer hover:bg-opacity-70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </div>
              <div className="custom-next absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 rounded-full p-2 cursor-pointer hover:bg-opacity-70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Swiper>
          </div>
        </div>
      )}
      <footer className="text-center text-xs text-gray-300">
        <span className="opacity-80">Provided by </span>
        <a
          href="https://www.tojoglobal.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors duration-200"
        >
          TOJO Global
        </a>
      </footer>
    </div>
  );
};

export default InstaComics;
