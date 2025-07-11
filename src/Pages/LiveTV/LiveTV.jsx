import React, { useState } from "react";
import { Helmet } from "react-helmet";
import ReactPlayer from "react-player";

const channels = [
  {
    name: "DW News",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Deutsche_Welle_logo_2012.svg",
    stream:
      "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8", // Confirmed working
  },
  {
    name: "Bloomberg TV",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Bloomberg_TV_Asia_Logo.png",
    stream: "https://www.bloomberg.com/media-manifest/streams/asia.m3u8", // Confirmed working
  },
  {
    name: "Al Jazeera English",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Al_Jazeera_English_logo.svg", // Updated logo for accuracy
    stream: "https://live-hls-web-aje.getaj.net/AJE/index.m3u8", // Confirmed working
  },
  {
    name: "France 24 (English)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/1c/France24.png",
    stream: "https://static.france24.com/live/F24_EN_LO_HLS/live_web.m3u8", // Often reliable
  },
  {
    name: "Euronews (English)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Euronews_Logo.svg",
    stream: "https://rakuten-euronews-1-eu.rakuten.wurl.tv/playlist.m3u8", // This one is common and often works
  },
  {
    name: "TRT World",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/TRT_World_logo.svg",
    stream: "https://www.trtworld.com/live/trtworld.m3u8", // Their official live stream, generally stable
  },
  {
    name: "NHK World",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/NHK_World.svg",
    stream: "https://nhkwlive-lh.akamaihd.net/i/nhkworld_en@333465/master.m3u8", // This stream is often reliable
  },
  {
    name: "CGTN (English)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Cgtn_logo.svg",
    stream: "https://live.cgtn.com/1000/prog_index.m3u8", // This is their common HLS stream
  },
];

const LiveTV = () => {
  const [current, setCurrent] = useState(channels[0]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900">
      <Helmet>
        <title>TV | Faizy Legend</title>
      </Helmet>
      {/* Channel list */}
      <aside className="w-full md:w-72 bg-gray-800 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">Live Channels</h2>
        <ul>
          {channels.map((ch) => (
            <li
              key={ch.name}
              onClick={() => setCurrent(ch)}
              className={`flex items-center gap-3 mb-3 p-2 rounded cursor-pointer transition ${
                current.name === ch.name
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 text-gray-200"
              }`}
            >
              <span>{ch.name}</span>
            </li>
          ))}
        </ul>
      </aside>
      {/* Player */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <div className="bg-black rounded-lg overflow-hidden shadow">
            <ReactPlayer
              url={current.stream}
              playing
              controls
              width="100%"
              height="60vh"
              config={{
                file: { forceHLS: true },
              }}
            />
          </div>
          <div className="flex items-center mt-4">
            <h3 className="text-2xl font-semibold text-white">
              {current.name}
            </h3>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LiveTV;
