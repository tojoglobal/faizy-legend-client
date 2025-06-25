import { useState } from "react";
import { Tab } from "@headlessui/react";
import { FiSearch, FiDownload, FiMaximize2 } from "react-icons/fi";

// Dummy data for premium design
const FANART_TABS = [
  { name: "Photos" },
  { name: "Videos" },
  { name: "Drawings" },
];

const FANART_IMAGES = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    title: "Green Dream",
    user: "Akash",
    tags: ["Nature", "Landscape"],
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    title: "Urban Splash",
    user: "Sana",
    tags: ["City", "Night"],
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1465101178521-c1a9136a3d41?auto=format&fit=crop&w=800&q=80",
    title: "Fan Art Collage",
    user: "Rafiq",
    tags: ["Art", "Fanart"],
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Fanart = () => {
  const [query, setQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [modalImage, setModalImage] = useState(null);

  // Filter logic (for real use, make it dynamic)
  const filteredImages = FANART_IMAGES.filter(
    (img) =>
      img.title.toLowerCase().includes(query.toLowerCase()) ||
      img.user.toLowerCase().includes(query.toLowerCase())
  );

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

        {/* Search Bar */}
        <div className="flex w-full max-w-xl mx-auto mb-7 relative">
          <input
            type="text"
            placeholder="Search by fan name, title, or tag..."
            className="w-full py-3 px-5 pl-12 rounded-xl shadow-lg border border-gray-200 focus:ring-2 focus:ring-indigo-300 bg-white text-gray-800 text-lg outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400" />
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
            {/* Only Photos tab has images for demo */}
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
                      onClick={() => setModalImage(img)}
                    >
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-56 object-cover transition-all duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          className="bg-white/80 rounded-full p-2 hover:bg-indigo-100 shadow"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalImage(img);
                          }}
                          aria-label="View large"
                        >
                          <FiMaximize2 className="text-xl text-indigo-600" />
                        </button>
                        <a
                          href={img.url}
                          download
                          className="bg-white/80 rounded-full p-2 hover:bg-pink-100 shadow"
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Download"
                        >
                          <FiDownload className="text-xl text-pink-500" />
                        </a>
                      </div>
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
            <Tab.Panel>
              <div className="h-48 flex items-center justify-center text-xl text-gray-400">
                No GIFs uploaded yet.
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="h-48 flex items-center justify-center text-xl text-gray-400">
                No drawings uploaded yet.
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Modal for large image */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          onClick={() => setModalImage(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-3xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalImage.url}
              alt={modalImage.title}
              className="w-full max-h-[80vh] object-contain"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <a
                href={modalImage.url}
                download
                className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-4 py-2 font-semibold shadow"
              >
                <FiDownload className="inline mr-2 -mt-1" /> Download
              </a>
              <button
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full px-4 py-2 font-semibold shadow"
                onClick={() => setModalImage(null)}
              >
                Close
              </button>
            </div>
            <div className="absolute bottom-4 left-6 text-lg font-bold text-gray-700 bg-white/80 rounded-xl px-4 py-2 shadow">
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
