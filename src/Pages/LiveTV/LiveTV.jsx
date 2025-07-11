import React, { useState } from "react";
import { Helmet } from "react-helmet";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";

// Importing Heroicons for better UX (you'll need to install it: npm install @heroicons/react)
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const channels = [
  {
    name: "DW News",
    stream:
      "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8",
    backup:
      "https://dwstream6-lh.akamaihd.net/i/dwstream6_live@123962/master.m3u8",
  },
  {
    name: "Bloomberg TV",
    stream: "https://www.bloomberg.com/media-manifest/streams/asia.m3u8",
    backup: "https://bloomberg-bloombergtv-1-eu.rakuten.wurl.tv/playlist.m3u8",
  },
  {
    name: "Al Jazeera English",
    stream: "https://live-hls-web-aje.getaj.net/AJE/index.m3u8",
    backup:
      "https://aljazeera-eng-hls-live.akamaized.net/hls/live/2003681/aljazeera-eng/index.m3u8",
  },
  {
    name: "Arirang TV",
    stream:
      "https://amdlive-ch01-ctnd-com.akamaized.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8",
    backup:
      "https://amdlive-ch01-ctnd-com.akamaized.net/arirang_1ch/smil:arirang_1ch.smil/chunklist_b2592000_sleng.m3u8",
  },
];

const navbarItems = [
  { name: "Home", link: "/" },
  { name: "Contact Us", link: "#" },
];

const LiveTV = () => {
  const [current, setCurrent] = useState(channels[0]);
  const [currentStream, setCurrentStream] = useState(channels[0].stream);
  const [isError, setIsError] = useState(false);
  const [showReloadMessage, setShowReloadMessage] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar

  const handleError = () => {
    if (!isError && current.backup) {
      setCurrentStream(current.backup);
      setIsError(true);
    } else {
      setShowReloadMessage(true);
    }
  };

  const changeChannel = (ch) => {
    setCurrent(ch);
    setCurrentStream(ch.stream);
    setIsError(false);
    setShowReloadMessage(false);
    setIsSidebarOpen(false); // Close sidebar on channel change
  };

  const handleReload = () => {
    setCurrentStream(current.stream);
    setIsError(false);
    setShowReloadMessage(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Helmet>
        <title>Live TV | Faizy Legend</title>
      </Helmet>

      {/* Navbar (Header) */}
      <header className="bg-gray-800 text-white py-3 px-4 md:px-6 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <div className="flex items-center">
          {/* Hamburger menu for mobile/tablet */}
          <button
            className="md:hidden cursor-pointer text-white mr-4 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle channels"
          >
            {isSidebarOpen ? (
              <XMarkIcon className="h-7 w-7" />
            ) : (
              <Bars3Icon className="h-7 w-7" />
            )}
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold text-yellow-400">
            Live TV
          </h1>
          {/* Desktop Navbar Items */}
          <nav className="hidden md:flex ml-8 space-x-6">
            {navbarItems.map((item) => (
              <Link
                key={item.name}
                to={item.link}
                className="text-lg font-medium hover:text-blue-400 transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm md:text-base font-semibold">
            Subscribe Now
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile/Tablet Sidebar Overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-75 z-40 md:hidden transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-100 visible" : "opacity-0 hidden"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 min-h-full w-64 bg-gray-800 p-6 shadow-xl z-40
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:min-w-[256px] md:z-auto lg:min-h-screen`}
        >
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h2 className="text-2xl font-bold text-white">Channels</h2>
            <button
              className="text-white cursor-pointer p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close channels"
            >
              <XMarkIcon className="h-7 w-7" />
            </button>
          </div>
          <h2 className="hidden md:block text-2xl font-bold text-white mb-6">
            Live Channels
          </h2>
          <ul className="space-y-3">
            {channels.map((ch) => (
              <li
                key={ch.name}
                onClick={() => changeChannel(ch)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 text-lg font-medium
                  ${
                    current.name === ch.name
                      ? "bg-blue-600 text-white shadow-md scale-105"
                      : "hover:bg-gray-700 text-gray-200 hover:text-white"
                  }`}
              >
                {ch.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Player Content */}
        <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
          <div className="w-full max-w-6xl mx-auto">
            {/* Video Player Container - maintains 16:9 aspect ratio */}
            <div className="relative pt-[56.25%] bg-black rounded-xl overflow-hidden shadow-2xl">
              {showReloadMessage ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-center text-yellow-300 p-4">
                  <p className="text-xl md:text-2xl mb-6 font-semibold">
                    Oops! Stream failed to load.
                  </p>
                  <button
                    onClick={handleReload}
                    className="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Reload Stream
                  </button>
                </div>
              ) : (
                <div className="absolute inset-0">
                  <ReactPlayer
                    url={currentStream}
                    playing
                    controls
                    width="100%"
                    height="100%"
                    onError={handleError}
                    config={{
                      file: {
                        forceHLS: true,
                        hlsOptions: {
                          xhrSetup: (xhr) => {
                            xhr.withCredentials = false;
                          },
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>
            <div className="mt-6 md:mt-8">
              <h3 className="text-3xl md:text-4xl font-extrabold text-blue-300 text-center md:text-left">
                {current.name}
              </h3>
              <p className="text-gray-400 mt-2 text-center md:text-left">
                Currently watching live broadcast.
              </p>
            </div>

            {/* Placeholder for "Up Next" or "Related Content" */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Example Card */}
              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold mb-2 text-gray-200">
                  Popular Shows
                </h4>
                <p className="text-gray-400 text-sm">
                  Discover more content from {current.name}.
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold mb-2 text-gray-200">
                  News Headlines
                </h4>
                <p className="text-gray-400 text-sm">
                  Stay updated with the latest news.
                </p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold mb-2 text-gray-200">
                  Upcoming Events
                </h4>
                <p className="text-gray-400 text-sm">
                  Check out what's scheduled next.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LiveTV;
