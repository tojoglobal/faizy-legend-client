import { useParams, Link } from "react-router-dom";
import ReactPlayer from "react-player";
import { useState, useRef, useEffect } from "react";
import channels from "./channels";

const schedule = [
  "12:04 PM: City Confidential - Midnight Pain in Georgia",
  "1:05 PM: The First 48 - Dangerous Company",
  "2:02 PM: Paid Program",
  "2:32 PM: NUWAVE FOREVER, AIR PURIFIER WITH NEVER REPLACE FILTERS",
  "3:02 PM: Freedom to Leave the House! Inogen Portable Oxygen",
  "3:31 PM: Paid Program",
];

const ChannelPlayer = () => {
  const { name } = useParams();
  const [loading, setLoading] = useState(true);
  const decodedName = decodeURIComponent(name);
  const playerRef = useRef(null);

  const current = channels.find((ch) => ch.name === decodedName);
  const stream = current?.stream || "";
  const backup = current?.backup || "";

  const [currentStream, setCurrentStream] = useState(stream);
  const [usedBackup, setUsedBackup] = useState(false);
  const [streamError, setStreamError] = useState(false);

  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef(null);

  // Update stream on reload or route change
  useEffect(() => {
    if (stream) {
      setCurrentStream(stream);
      setUsedBackup(false);
      setStreamError(false);
    }
  }, [stream]);

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
      controlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    handleMouseMove();
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, []);

  const handlePlayPause = () => setPlaying(!playing);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const toggleMute = () => setMuted(!muted);

  const handleFullscreen = () => {
    const playerWrapper = playerRef.current?.wrapper;
    if (playerWrapper) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        playerWrapper.requestFullscreen();
      }
    }
  };

  const handleError = () => {
    console.warn("Error loading stream:", currentStream);
    if (!usedBackup && backup && currentStream !== backup) {
      console.log("Switching to backup stream...");
      setCurrentStream(backup);
      setUsedBackup(true);
    } else {
      console.error("Both streams failed.");
      setStreamError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* Navbar */}
      <div className="bg-black text-white">
        <header className="max-w-6xl 2xl:max-w-[1350px] mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/tv">
            <h1 className="text-2xl font-bold">TheTVApp</h1>
          </Link>
          <div className="space-x-4 text-sm">
            <Link to="/">Home</Link>
            <button className="border cursor-pointer px-3 py-1 rounded hover:bg-white hover:text-black transition">
              Contact Us
            </button>
            <button className="bg-blue-600 px-3 cursor-pointer py-1 rounded hover:bg-blue-700">
              Subscribe Now
            </button>
          </div>
        </header>
      </div>

      {/* Main */}
      <main className="max-w-6xl mx-auto p-5">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Player */}
          <div className="w-full md:w-[65%]">
            <h2 className="text-2xl font-bold mb-2">{decodedName}</h2>
            <div className="bg-black rounded overflow-hidden relative group aspect-video">
              {loading && !streamError && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-80 text-white text-lg">
                  Loading...
                </div>
              )}

              {!streamError ? (
                <>
                  <ReactPlayer
                    ref={playerRef}
                    url={currentStream}
                    playing={playing}
                    volume={muted ? 0 : volume}
                    width="100%"
                    height="100%"
                    controls={false}
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
                    onError={handleError}
                    onReady={() => setLoading(false)}
                  />
                  {showControls && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={handlePlayPause}
                          className="text-white cursor-pointer hover:text-gray-300"
                        >
                          {playing ? "⏸" : "▶️"}
                        </button>
                        <button
                          onClick={toggleMute}
                          className="text-white cursor-pointer hover:text-gray-300"
                        >
                          {muted || volume === 0 ? "🔇" : "🔊"}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={muted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-20 accent-white cursor-pointer"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                          LIVE
                        </span>
                        <button
                          onClick={handleFullscreen}
                          className="text-white cursor-pointer hover:text-gray-300"
                        >
                          ⛶
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-white bg-black flex justify-center items-center h-full">
                  <p>Stream unavailable. Please try again later.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-[35%] bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-600 mb-4">
              Saturday, July 12, 2025
            </p>
            <h3 className="font-semibold mb-2">TV Schedule</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              {schedule.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">All Channels</h4>
              <ul className="text-sm list-disc list-inside space-y-1">
                {channels.map((ch) => (
                  <li key={ch.name}>
                    <Link
                      to={`/tv/${encodeURIComponent(ch.name)}`}
                      className="text-blue-600 hover:underline"
                    >
                      {ch.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChannelPlayer;
