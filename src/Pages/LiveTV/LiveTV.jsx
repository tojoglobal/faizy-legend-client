import React, { useState } from "react";
import { Helmet } from "react-helmet";
import ReactPlayer from "react-player";

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

const LiveTV = () => {
  const [current, setCurrent] = useState(channels[0]);
  const [currentStream, setCurrentStream] = useState(channels[0].stream);
  const [isError, setIsError] = useState(false);

  const handleError = () => {
    if (!isError && current.backup) {
      setCurrentStream(current.backup);
      setIsError(true);
    }
  };

  const changeChannel = (ch) => {
    setCurrent(ch);
    setCurrentStream(ch.stream);
    setIsError(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900">
      <Helmet>
        <title>Live TV | Faizy Legend</title>
      </Helmet>

      {/* Channel list */}
      <aside className="w-full md:w-72 bg-gray-800 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">Live Channels</h2>
        <ul>
          {channels.map((ch) => (
            <li
              key={ch.name}
              onClick={() => changeChannel(ch)}
              className={`mb-3 p-2 rounded cursor-pointer transition ${
                current.name === ch.name
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 text-gray-200"
              }`}
            >
              {ch.name}
              {current.name === ch.name && isError && (
                <span className="text-yellow-300 text-xs block">
                  Using backup stream
                </span>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {/* Player */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="bg-black rounded-lg overflow-hidden shadow-lg">
            <ReactPlayer
              url={currentStream}
              playing
              controls
              width="100%"
              height="60vh"
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
          <div className="mt-4">
            <h3 className="text-2xl font-semibold text-white">
              {current.name}
              {isError && (
                <span className="text-yellow-400 text-sm ml-2">
                  (Backup stream)
                </span>
              )}
            </h3>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveTV;
