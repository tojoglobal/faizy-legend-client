import { useState } from "react";
import { Tab } from "@headlessui/react";
import { FiSearch, FiDownload, FiMaximize2 } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Dummy data for premium design
const FANART_TABS = [{ name: "Photos" }, { name: "Videos" }];

// Sample data: each item can have multiple images (gallery array)
const FANART_IMAGES = [
  {
    id: 1,
    gallery: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1465101178521-c1a9136a3d41?auto=format&fit=crop&w=800&q=80",
    ],
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    title: "Green Dream",
    user: "Akash",
    tags: ["Nature", "Landscape"],
    type: "photo",
    date: "2025-06-22T10:00:00Z",
  },
  {
    id: 2,
    gallery: [
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    ],
    url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    title: "Urban Splash",
    user: "Sana",
    tags: ["City", "Night"],
    type: "photo",
    date: "2025-06-23T12:00:00Z",
  },
  {
    id: 3,
    gallery: [
      "https://images.unsplash.com/photo-1465101178521-c1a9136a3d41?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    ],
    url: "https://images.unsplash.com/photo-1465101178521-c1a9136a3d41?auto=format&fit=crop&w=800&q=80",
    title: "Fan Art Collage",
    user: "Rafiq",
    tags: ["Art", "Fanart"],
    type: "photo",
    date: "2025-06-20T09:00:00Z",
  },
];

// Utility for classNames
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "A-Z", value: "az" },
  { label: "Z-A", value: "za" },
];

const Fanart = () => {
  const [query, setQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [modalImage, setModalImage] = useState(null); // { ...img, index }
  const [sortBy, setSortBy] = useState("newest");

  // Filter by tab and search
  let filteredImages = FANART_IMAGES.filter(
    (img) =>
      (img.title.toLowerCase().includes(query.toLowerCase()) ||
        img.user.toLowerCase().includes(query.toLowerCase())) &&
      (selectedTab === 0 ||
        img.type === FANART_TABS[selectedTab].name.toLowerCase().slice(0, -1))
  );

  // Sort
  if (sortBy === "newest") {
    filteredImages = filteredImages.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  } else if (sortBy === "oldest") {
    filteredImages = filteredImages.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  } else if (sortBy === "az") {
    filteredImages = filteredImages.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  } else if (sortBy === "za") {
    filteredImages = filteredImages.sort((a, b) =>
      b.title.localeCompare(a.title)
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f7fb] via-[#f2f2f7] to-[#f9fafb] px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Fan Art Gallery
          </h1>
          <p className="text-lg text-gray-500 mt-2">
            Search, view and download premium fan art curated by our team.
          </p>
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full max-w-xl mx-auto mb-7">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by fan name, title, or tag..."
              className="w-full py-3 px-5 pl-12 rounded-xl shadow-lg border border-gray-200 focus:ring-2 focus:ring-indigo-300 bg-white text-gray-800 text-lg outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400" />
          </div>
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-4 rounded-xl border border-gray-200 bg-white text-gray-700 shadow focus:ring-2 focus:ring-indigo-300 text-base"
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
          <Tab.List className="flex space-x-2 justify-center mb-10">
            {FANART_TABS.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    "px-5 py-2.5 rounded-2xl transition-all text-lg font-semibold focus:outline-none",
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
            <Tab.Panel>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
                {filteredImages.length === 0 && (
                  <div className="col-span-full text-center text-gray-400 py-16 text-xl">
                    No fan art found matching your search.
                  </div>
                )}
                {filteredImages.map((img) => (
                  <div
                    key={img.id}
                    className="bg-white rounded-3xl overflow-hidden drop-shadow-xl flex flex-col group transition-transform hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div
                      className="relative cursor-pointer"
                      onClick={() => setModalImage({ ...img, index: 0 })}
                    >
                      <img
                        src={img.gallery?.[0] || img.url}
                        alt={img.title}
                        className="w-full h-56 object-cover transition-all duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          className="bg-white/80 rounded-full p-2 hover:bg-indigo-100 shadow"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalImage({ ...img, index: 0 });
                          }}
                          aria-label="View large"
                        >
                          <FiMaximize2 className="text-xl text-indigo-600" />
                        </button>
                        <a
                          href={img.gallery?.[0] || img.url}
                          download
                          className="bg-white/80 rounded-full p-2 hover:bg-pink-100 shadow"
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Download"
                        >
                          <FiDownload className="text-xl text-pink-500" />
                        </a>
                      </div>
                      {img.gallery && img.gallery.length > 1 && (
                        <span className="absolute bottom-2 left-2 bg-white/80 text-xs text-indigo-700 rounded-full px-3 py-1 font-semibold shadow">
                          +{img.gallery.length} images
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg text-gray-700">
                          {img.title}
                        </span>
                        <span className="ml-auto text-xs text-indigo-500 rounded-full px-2 py-0.5 bg-indigo-50 font-semibold">
                          by {img.user}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {img.tags.map((tag) => (
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
            </Tab.Panel>
            {/* Placeholder for other tabs */}
            <Tab.Panel>
              <div className="h-48 flex items-center justify-center text-xl text-gray-400">
                No videos uploaded yet.
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Modal for large image(s) with Swiper */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          onClick={() => setModalImage(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-3xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {modalImage.gallery && modalImage.gallery.length > 1 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                initialSlide={modalImage.index || 0}
                className="w-full"
              >
                {modalImage.gallery.map((imgUrl) => (
                  <SwiperSlide key={imgUrl}>
                    <img
                      src={imgUrl}
                      alt={modalImage.title}
                      className="w-full max-h-[80vh] object-contain"
                    />
                    {/* Merged Button Group */}
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <div className="flex gap-2">
                        <a
                          href={imgUrl}
                          download
                          className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-4 py-2 font-semibold shadow flex items-center"
                        >
                          <FiDownload className="inline mr-2 -mt-1" /> Download
                        </a>
                        <button
                          className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full px-4 py-2 font-semibold shadow flex items-center"
                          onClick={() => setModalImage(null)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <>
                <img
                  src={modalImage.url}
                  alt={modalImage.title}
                  className="w-full max-h-[80vh] object-contain"
                />
                {/* Merged Button Group */}
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <div className="flex gap-2">
                    <a
                      href={modalImage.url}
                      download
                      className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-4 py-2 font-semibold shadow flex items-center"
                    >
                      <FiDownload className="inline mr-2 -mt-1" /> Download
                    </a>
                    <button
                      className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full px-4 py-2 font-semibold shadow flex items-center"
                      onClick={() => setModalImage(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            )}
            <div className="absolute bottom-4 left-6 text-lg font-bold text-gray-700 bg-white/80 rounded-xl px-4 py-2 shadow z-10">
              {modalImage.title}{" "}
              <span className="font-normal text-gray-500 text-base">
                by {modalImage.user}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fanart;
