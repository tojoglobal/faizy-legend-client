import { useState, useMemo } from "react";
import { Tab } from "@headlessui/react";
import { FiSearch, FiDownload, FiMaximize2 } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useDataQuery from "../utils/useDataQuery"; // Adjust if needed
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const FANART_TABS = [{ name: "Fan Art" }, { name: "Dance" }, { name: "Face" }];

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "A-Z", value: "az" },
  { label: "Z-A", value: "za" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const API = "/api/fan-art";

const Fanart = () => {
  const [query, setQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [modalItem, setModalItem] = useState(null);
  const [sortBy, setSortBy] = useState("newest");

  const { data: apiData, isLoading, error } = useDataQuery(["fanArt"], API);

  // Prepare and normalize data (add vitiligoFace if present)
  const items = useMemo(() => {
    if (!apiData?.rows) return [];
    return apiData.rows
      .filter((item) => item.approved === 1)
      .map((item) => {
        let images = [];
        let videos = [];
        let tags = [];
        let vitiligoFace = [];
        try {
          images =
            typeof item.images === "string"
              ? JSON.parse(item.images)
              : item.images || [];
        } catch {
          images = [];
        }
        try {
          videos =
            typeof item.videos === "string"
              ? JSON.parse(item.videos)
              : item.videos || [];
        } catch {
          videos = [];
        }
        try {
          vitiligoFace =
            typeof item.vitiligoFace === "string"
              ? JSON.parse(item.vitiligoFace)
              : item.vitiligoFace || [];
        } catch {
          vitiligoFace = [];
        }
        tags =
          typeof item.tags === "string"
            ? item.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : item.tags || [];
        const apiBase = import.meta.env.VITE_OPEN_APIURL || "";
        return {
          id: item.id,
          title: item.title,
          user: item.user,
          date: item.created_at,
          tags,
          images: images.map((img) =>
            img.startsWith("http") ? img : `${apiBase}${img}`
          ),
          videos: videos.map((vid) =>
            vid.startsWith("http") ? vid : `${apiBase}${vid}`
          ),
          vitiligoFace: vitiligoFace.map((img) =>
            img.startsWith("http") ? img : `${apiBase}${img}`
          ),
        };
      });
  }, [apiData]);

  // Unified search by user (and optionally title/tag for legacy)
  const normalizedQuery = query.toLowerCase();
  const filteredPhotos = useMemo(() => {
    let arr = items.filter(
      (item) =>
        item.images.length > 0 &&
        (item.user?.toLowerCase().includes(normalizedQuery) ||
          item.title?.toLowerCase().includes(normalizedQuery) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery)))
    );
    if (sortBy === "newest") {
      arr = arr.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "oldest") {
      arr = arr.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === "az") {
      arr = arr.sort((a, b) => a.user.localeCompare(b.user));
    } else if (sortBy === "za") {
      arr = arr.sort((a, b) => b.user.localeCompare(a.user));
    }
    return arr;
  }, [items, normalizedQuery, sortBy]);

  const filteredVideos = useMemo(() => {
    let arr = items.filter(
      (item) =>
        item.videos.length > 0 &&
        (item.user?.toLowerCase().includes(normalizedQuery) ||
          item.title?.toLowerCase().includes(normalizedQuery) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery)))
    );
    if (sortBy === "newest") {
      arr = arr.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "oldest") {
      arr = arr.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === "az") {
      arr = arr.sort((a, b) => a.user.localeCompare(b.user));
    } else if (sortBy === "za") {
      arr = arr.sort((a, b) => b.user.localeCompare(a.user));
    }
    return arr;
  }, [items, normalizedQuery, sortBy]);

  const filteredFaces = useMemo(() => {
    let arr = items.filter(
      (item) =>
        item.vitiligoFace?.length > 0 &&
        (item.user?.toLowerCase().includes(normalizedQuery) ||
          item.title?.toLowerCase().includes(normalizedQuery) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery)))
    );
    if (sortBy === "newest") {
      arr = arr.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "oldest") {
      arr = arr.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === "az") {
      arr = arr.sort((a, b) => a.user.localeCompare(b.user));
    } else if (sortBy === "za") {
      arr = arr.sort((a, b) => b.user.localeCompare(a.user));
    }
    return arr;
  }, [items, normalizedQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f7fb] via-[#f2f2f7] to-[#f9fafb] p-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex w-full sm:w-auto justify-center">
          <Link
            to="/add-fanart"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-pink-500 hover:from-indigo-700 hover:to-pink-600 text-white px-4 py-1.5 rounded-lg font-semibold text-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Upload Your Work
          </Link>
        </div>
        {/* Search + Sort */}
        <div className="flex flex-col mt-4 sm:flex-row sm:items-center gap-4 w-full max-w-xl mx-auto mb-5">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search name"
              className="w-full py-2.5 px-5 pl-12 rounded-xl shadow-lg border border-gray-200 bg-white text-gray-800 text-lg outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400" />
          </div>
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-4 rounded-xl border focus:outline-none border-gray-200 bg-white text-gray-700 shadow cursor-pointer text-base"
            >
              {SORT_OPTIONS.map((opt) => (
                <option value={opt.value} key={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Tabs for asset type */}
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-2 justify-center mb-7">
            {FANART_TABS.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    "px-5 py-1.5 rounded-xl transition-all text-lg font-semibold focus:outline-none cursor-pointer",
                    selected
                      ? "bg-gradient-to-r from-indigo-600 to-pink-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )
                }
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            {/* Fan Art */}
            <Tab.Panel>
              {isLoading ? (
                <div className="text-center py-20 text-xl text-gray-400">
                  Loading...
                </div>
              ) : error ? (
                <div className="text-center py-20 text-xl text-red-400">
                  Error loading fan art.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
                  {filteredPhotos.length === 0 && (
                    <div className="col-span-full text-center text-gray-400 py-16 text-xl">
                      No fan art found matching your search.
                    </div>
                  )}
                  {filteredPhotos.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl overflow-hidden drop-shadow-xl flex flex-col group transition-transform hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <div
                        className="relative cursor-pointer"
                        onClick={() =>
                          setModalItem({ ...item, index: 0, mode: "photo" })
                        }
                      >
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-56 object-cover transition-all duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            className="bg-white/80 cursor-pointer rounded-full p-2 hover:bg-indigo-100 shadow"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalItem({
                                ...item,
                                index: 0,
                                mode: "photo",
                              });
                            }}
                            aria-label="View large"
                          >
                            <FiMaximize2 className="text-xl text-indigo-600" />
                          </button>
                          <a
                            href={item.images[0]}
                            download
                            className="bg-white/80 rounded-full p-2 hover:bg-pink-100 shadow"
                            onClick={(e) => e.stopPropagation()}
                            aria-label="Download"
                          >
                            <FiDownload className="text-xl text-pink-500" />
                          </a>
                        </div>
                        {item.images.length > 1 && (
                          <span className="absolute bottom-2 left-2 bg-white/80 text-xs text-indigo-700 rounded-full px-3 py-1 font-semibold shadow">
                            +{item.images.length} images
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-lg text-gray-700">
                            {item.user}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Tab.Panel>
            {/* Dance (Videos) */}
            <Tab.Panel>
              {isLoading ? (
                <div className="text-center py-20 text-xl text-gray-400">
                  Loading...
                </div>
              ) : error ? (
                <div className="text-center py-20 text-xl text-red-400">
                  Error loading dance videos.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
                  {filteredVideos.length === 0 && (
                    <div className="col-span-full text-center text-gray-400 py-16 text-xl">
                      No dance videos found matching your search.
                    </div>
                  )}
                  {filteredVideos.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl overflow-hidden drop-shadow-xl flex flex-col group transition-transform hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <div className="relative cursor-pointer">
                        <video
                          src={item.videos[0]}
                          className="w-full h-56 object-cover transition-all duration-300 group-hover:scale-105"
                          controls
                          preload="metadata"
                          poster=""
                          style={{ background: "#000" }}
                        />
                        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            className="bg-white/80 cursor-pointer rounded-full p-2 hover:bg-indigo-100 shadow"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalItem({
                                ...item,
                                index: 0,
                                mode: "video",
                              });
                            }}
                            aria-label="View large"
                          >
                            <FiMaximize2 className="text-xl text-indigo-600" />
                          </button>
                          <a
                            href={item.videos[0]}
                            download
                            className="bg-white/80 rounded-full p-2 hover:bg-pink-100 shadow"
                            onClick={(e) => e.stopPropagation()}
                            aria-label="Download"
                          >
                            <FiDownload className="text-xl text-pink-500" />
                          </a>
                        </div>
                        {item.videos.length > 1 && (
                          <span className="absolute bottom-0 left-2 bg-white/80 text-xs text-indigo-700 rounded-full px-3 py-1 font-semibold shadow">
                            +{item.videos.length} videos
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-lg text-gray-700">
                            {item.user}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Tab.Panel>
            {/* Face */}
            <Tab.Panel>
              {isLoading ? (
                <div className="text-center py-20 text-xl text-gray-400">
                  Loading...
                </div>
              ) : error ? (
                <div className="text-center py-20 text-xl text-red-400">
                  Error loading faces.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
                  {filteredFaces.length === 0 && (
                    <div className="col-span-full text-center text-gray-400 py-16 text-xl">
                      No faces found matching your search.
                    </div>
                  )}
                  {filteredFaces.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl overflow-hidden drop-shadow-xl flex flex-col group transition-transform hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <div className="relative cursor-pointer">
                        <img
                          src={item.vitiligoFace[0]}
                          alt={item.user}
                          className="w-full h-56 object-cover transition-all duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition">
                          <button
                            className="bg-white/80 rounded-full cursor-pointer p-2 hover:bg-indigo-100 shadow"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalItem({
                                ...item,
                                index: 0,
                                mode: "face",
                              });
                            }}
                            aria-label="View large"
                          >
                            <FiMaximize2 className="text-xl text-indigo-600" />
                          </button>
                          <a
                            href={item.vitiligoFace[0]}
                            download
                            className="bg-white/80 rounded-full p-2 hover:bg-pink-100 shadow"
                            onClick={(e) => e.stopPropagation()}
                            aria-label="Download"
                          >
                            <FiDownload className="text-xl text-pink-500" />
                          </a>
                        </div>
                        {item.vitiligoFace.length > 1 && (
                          <span className="absolute bottom-2 left-2 bg-white/80 text-xs text-indigo-700 rounded-full px-3 py-1 font-semibold shadow">
                            +{item.vitiligoFace.length} images
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-lg text-gray-700">
                            {item.user}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Modal for large image(s) or video(s) with Swiper */}
      {modalItem && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          onClick={() => setModalItem(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-3xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {modalItem.mode === "photo" && modalItem.images.length > 1 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                initialSlide={modalItem.index || 0}
                className="w-full"
              >
                {modalItem.images.map((imgUrl) => (
                  <SwiperSlide key={imgUrl}>
                    <div className="relative flex items-center justify-center bg-white h-[80vh]">
                      <img
                        src={imgUrl}
                        alt={modalItem.user}
                        className="object-contain max-h-full max-w-full mx-auto"
                      />
                      <div className="absolute top-4 right-4 flex gap-2 z-10">
                        <a
                          href={imgUrl}
                          download
                          className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-4 py-2 font-semibold shadow flex items-center"
                        >
                          <FiDownload className="inline mr-2 -mt-1" /> Download
                        </a>
                        <button
                          className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-900 rounded-full px-4 py-2 font-semibold shadow flex items-center"
                          onClick={() => setModalItem(null)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : modalItem.mode === "photo" ? (
              <div className="relative flex items-center justify-center bg-white h-[80vh]">
                <img
                  src={modalItem.images[0]}
                  alt={modalItem.user}
                  className="object-contain max-h-full max-w-full mx-auto"
                />
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <a
                    href={modalItem.images[0]}
                    download
                    className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-4 py-2 font-semibold shadow flex items-center"
                  >
                    <FiDownload className="inline mr-2 -mt-1" /> Download
                  </a>
                  <button
                    className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-900 rounded-full px-4 py-2 font-semibold shadow flex items-center"
                    onClick={() => setModalItem(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : modalItem.mode === "video" && modalItem.videos.length > 1 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                initialSlide={modalItem.index || 0}
                className="w-full"
              >
                {modalItem.videos.map((vidUrl) => (
                  <SwiperSlide key={vidUrl}>
                    <div className="relative flex items-center justify-center bg-white h-[80vh]">
                      <video
                        src={vidUrl}
                        className="object-contain max-h-full max-w-full mx-auto"
                        controls
                        preload="metadata"
                        style={{ background: "#000" }}
                      />
                      <div className="absolute top-4 right-4 flex gap-2 z-10">
                        <a
                          href={vidUrl}
                          download
                          className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-4 py-2 font-semibold shadow flex items-center"
                        >
                          <FiDownload className="inline mr-2 -mt-1" /> Download
                        </a>
                        <button
                          className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-900 rounded-full px-4 py-2 font-semibold shadow flex items-center"
                          onClick={() => setModalItem(null)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : modalItem.mode === "face" &&
              modalItem.vitiligoFace.length > 1 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                initialSlide={modalItem.index || 0}
                className="w-full"
              >
                {modalItem.vitiligoFace.map((imgUrl) => (
                  <SwiperSlide key={imgUrl}>
                    <div className="relative flex items-center justify-center bg-white h-[80vh]">
                      <img
                        src={imgUrl}
                        alt={modalItem.user}
                        className="object-contain max-h-full max-w-full mx-auto"
                      />
                      <div className="absolute top-4 right-4 flex gap-2 z-10">
                        <a
                          href={imgUrl}
                          download
                          className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-4 py-2 font-semibold shadow flex items-center"
                        >
                          <FiDownload className="inline mr-2 -mt-1" /> Download
                        </a>
                        <button
                          className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-900 rounded-full px-4 py-2 font-semibold shadow flex items-center"
                          onClick={() => setModalItem(null)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : modalItem.mode === "face" ? (
              <div className="relative flex items-center justify-center bg-white h-[80vh]">
                <img
                  src={modalItem.vitiligoFace[0]}
                  alt={modalItem.user}
                  className="object-contain max-h-full max-w-full mx-auto"
                />
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <a
                    href={modalItem.vitiligoFace[0]}
                    download
                    className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-4 py-2 font-semibold shadow cursor-pointer flex items-center"
                  >
                    <FiDownload className="inline mr-2 -mt-1" /> Download
                  </a>
                  <button
                    className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-900 rounded-full px-4 py-2 font-semibold shadow flex items-center"
                    onClick={() => setModalItem(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative flex items-center justify-center bg-white h-[80vh]">
                <video
                  src={modalItem.videos[0]}
                  className="object-contain max-h-full max-w-full mx-auto"
                  controls
                  preload="metadata"
                  style={{ background: "#000" }}
                />
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <a
                    href={modalItem.videos[0]}
                    download
                    className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-4 py-2 font-semibold shadow flex items-center"
                  >
                    <FiDownload className="inline mr-2 -mt-1" /> Download
                  </a>
                  <button
                    className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-900 rounded-full px-4 py-2 font-semibold shadow flex items-center"
                    onClick={() => setModalItem(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Fanart;
