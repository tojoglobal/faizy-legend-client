import { useState, useMemo } from "react";
import { Tab } from "@headlessui/react";
import { FiSearch, FiDownload, FiMaximize2 } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import ReactPlayer from "react-player";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useDataQuery from "../utils/useDataQuery"; // Adjust if needed
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const FANART_TABS = [{ name: "Photos" }, { name: "Videos" }];
const PAGE_SIZES = [6, 9, 12];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "A-Z", value: "az" },
  { label: "Z-A", value: "za" },
];

const API = "/api/fan-art";

const Fanart = () => {
  const [query, setQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [modalItem, setModalItem] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [playingIndex, setPlayingIndex] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(9);

  const {
    data: apiData,
    isLoading,
    error,
  } = useDataQuery(
    ["fanArt", page, perPage],
    `${API}?page=${page}&limit=${perPage}`
  );

  // Prepare and normalize data
  const items = useMemo(() => {
    if (!apiData?.rows) return [];
    return apiData.rows
      .filter((item) => item.approved === 1)
      .map((item) => {
        let images = [];
        let videos = [];
        let tags = [];
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
        };
      });
  }, [apiData]);

  const filteredPhotos = useMemo(() => {
    let arr = items.filter(
      (item) =>
        item.images.length > 0 &&
        (item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.user.toLowerCase().includes(query.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          ))
    );
    if (sortBy === "newest") {
      arr = arr.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "oldest") {
      arr = arr.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === "az") {
      arr = arr.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "za") {
      arr = arr.sort((a, b) => b.title.localeCompare(a.title));
    }
    return arr;
  }, [items, query, sortBy]);

  const filteredVideos = useMemo(() => {
    let arr = items.filter(
      (item) =>
        item.videos.length > 0 &&
        (item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.user.toLowerCase().includes(query.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          ))
    );
    if (sortBy === "newest") {
      arr = arr.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "oldest") {
      arr = arr.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === "az") {
      arr = arr.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "za") {
      arr = arr.sort((a, b) => b.title.localeCompare(a.title));
    }
    return arr;
  }, [items, query, sortBy]);

  const total = apiData?.total || 0;
  const lastPage = apiData?.lastPage || 1;

  // Pagination controls component (centered at bottom of cards)
  function PaginationControls() {
    if (lastPage <= 1) return null;
    return (
      <div className="flex justify-center items-center gap-2 mt-10 select-none">
        <button
          className="px-2 py-1 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-50"
          onClick={() => setPage(1)}
          disabled={page === 1}
        >
          &laquo; First
        </button>
        <button
          className="px-2 py-1 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        {Array.from({ length: lastPage }, (_, i) => i + 1)
          .filter(
            (n) => n === 1 || n === lastPage || (n >= page - 1 && n <= page + 1)
          )
          .map((n, idx, arr) =>
            idx > 0 && n - arr[idx - 1] > 1 ? (
              <span key={n + "-dots"} className="px-1 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={n}
                className={`px-3 py-1 rounded ${
                  n === page
                    ? "bg-indigo-600 text-white shadow font-bold"
                    : "hover:bg-gray-200 text-gray-700"
                }`}
                onClick={() => setPage(n)}
                disabled={n === page}
              >
                {n}
              </button>
            )
          )}
        <button
          className="px-2 py-1 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
          disabled={page === lastPage}
        >
          Next
        </button>
        <button
          className="px-2 py-1 rounded hover:bg-gray-200 text-gray-700 disabled:opacity-50"
          onClick={() => setPage(lastPage)}
          disabled={page === lastPage}
        >
          Last &raquo;
        </button>
        <span className="ml-2 text-gray-500 text-sm">
          Page {page} of {lastPage} ({total} total)
        </span>
      </div>
    );
  }

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
        <div className="flex flex-col mt-3 sm:flex-row sm:items-center gap-4 w-full max-w-xl mx-auto mb-5">
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
        {/* Show select page size */}
        <div className="flex justify-center items-center gap-2 mb-4">
          <span className="mr-2 text-sm text-gray-500">Show:</span>
          <select
            className="border rounded px-2 py-1 text-sm focus:outline-none cursor-pointer"
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            {PAGE_SIZES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        {/* Tabs for asset type */}
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-2 justify-center mb-8">
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
            {/* Photos */}
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
                <>
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
                              className="bg-white/80 rounded-full p-2 hover:bg-indigo-100 shadow"
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
                              {item.title}
                            </span>
                            <span className="ml-auto text-xs text-indigo-500 rounded-full px-2 py-0.5 bg-indigo-50 font-semibold">
                              by {item.user}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-gradient-to-r from-pink-200 to-indigo-100 text-indigo-700 rounded-full px-2 py-0.5 text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <PaginationControls />
                </>
              )}
            </Tab.Panel>
            {/* Videos */}
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
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
                    {filteredVideos.length === 0 && (
                      <div className="col-span-full text-center text-gray-400 py-16 text-xl">
                        No videos found matching your search.
                      </div>
                    )}
                    {filteredVideos.map((item, idx) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-3xl overflow-hidden drop-shadow-xl flex flex-col group transition-transform hover:-translate-y-1 hover:shadow-2xl"
                      >
                        <div className="relative cursor-pointer">
                          <ReactPlayer
                            url={item.videos[0]}
                            width="100%"
                            height="225px"
                            controls
                            playing={playingIndex === idx}
                            onPlay={() => setPlayingIndex(idx)}
                            onPause={() => setPlayingIndex(null)}
                            onClickPreview={() => setPlayingIndex(idx)}
                            light={true}
                            playIcon={
                              <button className="bg-white/80 cursor-pointer rounded-full p-3 hover:bg-indigo-100 shadow border border-indigo-300">
                                <svg
                                  viewBox="0 0 24 24"
                                  className="w-8 h-8 text-indigo-600"
                                >
                                  <polygon
                                    points="5,3 19,12 5,21"
                                    fill="currentColor"
                                  />
                                </svg>
                              </button>
                            }
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
                                setPlayingIndex(null);
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
                          <div className="flex flex-wrap gap-2 mt-1">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-gradient-to-r from-pink-200 to-indigo-100 text-indigo-700 rounded-full px-2 py-0.5 text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <PaginationControls />
                </>
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
                    <img
                      src={imgUrl}
                      alt={modalItem.title}
                      className="w-full max-h-[80vh] object-contain"
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
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : modalItem.mode === "photo" ? (
              <>
                <img
                  src={modalItem.images[0]}
                  alt={modalItem.title}
                  className="w-full max-h-[80vh] object-contain"
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
              </>
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
                    <ReactPlayer
                      url={vidUrl}
                      width="100%"
                      height="60vh"
                      controls
                      playing={false}
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
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <>
                <ReactPlayer
                  url={modalItem.videos[0]}
                  width="100%"
                  height="60vh"
                  controls
                  playing={false}
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
              </>
            )}
            {/* <div className="absolute bottom-4 left-6 text-lg font-bold text-gray-700 bg-white/80 rounded-xl px-4 py-2 shadow z-10">
              {modalItem.title}{" "}
              <span className="font-normal text-gray-500 text-base">
                by {modalItem.user}
              </span>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Fanart;
