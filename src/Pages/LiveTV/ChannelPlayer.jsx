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
  const decodedName = decodeURIComponent(name);

  const [currentStream, setCurrentStream] = useState(null);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [streamError, setStreamError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const playerRef = useRef(null);
  const retryTimeout = useRef(null);
  const controlsTimeout = useRef(null);
  const updateTimeout = useRef(null);

  // Debounce stream changes to smooth UX
  useEffect(() => {
    const channel = channels.find((ch) => ch.name === decodedName);

    if (!channel) {
      setStreamError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setStreamError(false);

    clearTimeout(updateTimeout.current);
    updateTimeout.current = setTimeout(() => {
      setCurrentStream(channel.stream);
      setRetryCount(0);
    }, 300);

    return () => clearTimeout(updateTimeout.current);
  }, [decodedName]);

  // Retry and backup stream logic
  const handleError = () => {
    setIsLoading(false);
    const channel = channels.find((ch) => ch.name === decodedName);

    if (channel?.backup && currentStream !== channel.backup) {
      setCurrentStream(channel.backup);
      setIsLoading(true);
      setStreamError(false);
      setRetryCount(0);
      return;
    }

    if (retryCount < maxRetries) {
      const nextRetry = retryCount + 1;
      retryTimeout.current = setTimeout(() => {
        setIsLoading(true);
        setRetryCount(nextRetry);
        setCurrentStream((prev) => prev);
      }, 2000);
    } else {
      setStreamError(true);
    }
  };

  const handleReady = () => {
    setIsLoading(false);
    setStreamError(false);
  };

  // Controls visibility timeout
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimeout.current);
      controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
    };

    handleMouseMove();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleMouseMove);

    return () => {
      clearTimeout(retryTimeout.current);
      clearTimeout(controlsTimeout.current);
      clearTimeout(updateTimeout.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleMouseMove);
    };
  }, []);

  // Control handlers
  const handlePlayPause = () => setPlaying(!playing);
  const toggleMute = () => setMuted(!muted);
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };
  const handleFullscreen = () => {
    const wrapper = playerRef.current?.wrapper;
    if (wrapper) {
      document.fullscreenElement
        ? document.exitFullscreen()
        : wrapper.requestFullscreen();
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Player Section */}
        <div className="w-full md:w-2/3">
          <div className="mb-4">
            <Link
              to="/tv"
              className="inline-flex items-center text-blue-600 hover:underline text-sm font-medium mb-1"
            >
              ← Back to List
            </Link>
            <h2 className="text-3xl font-bold text-gray-800">{decodedName}</h2>
          </div>
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video shadow-lg">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-white text-lg z-20">
                Loading...
              </div>
            )}
            {streamError && !isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white z-20 p-6 rounded-lg">
                <p className="text-red-500 font-semibold mb-2 text-xl">
                  Stream Error
                </p>
                <p className="mb-4">
                  Failed to load the video stream after multiple attempts.
                </p>
                <button
                  onClick={() => {
                    setRetryCount(0);
                    setStreamError(false);
                    setIsLoading(true);
                    const channel = channels.find(
                      (ch) => ch.name === decodedName
                    );
                    setCurrentStream(channel?.stream || null);
                  }}
                  className="px-6 py-2 cursor-pointer bg-blue-600 rounded hover:bg-blue-700 transition"
                >
                  Retry Stream
                </button>
              </div>
            )}

            {currentStream && (
              <ReactPlayer
                ref={playerRef}
                url={currentStream}
                playing={playing}
                volume={muted ? 0 : volume}
                width="100%"
                height="100%"
                controls={false}
                onError={handleError}
                onReady={handleReady}
                config={{
                  file: {
                    forceHLS: true,
                    hlsOptions: {
                      xhrSetup: (xhr) => (xhr.withCredentials = false),
                    },
                  },
                }}
              />
            )}

            {/* Controls */}
            {currentStream && !isLoading && !streamError && (
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex justify-between items-center transition-opacity duration-300 ${
                  showControls ? "opacity-100" : "opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center space-x-5">
                  <button
                    onClick={handlePlayPause}
                    className="text-white cursor-pointer hover:text-gray-300"
                    aria-label={playing ? "Pause" : "Play"}
                  >
                    {playing ? "⏸" : "▶️"}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="text-white cursor-pointer hover:text-gray-300"
                    aria-label={muted ? "Unmute" : "Mute"}
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
                    className="w-28 accent-white cursor-pointer"
                    aria-label="Volume control"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <span className="bg-red-600 text-white text-xs px-3 py-1 rounded font-semibold tracking-wide select-none">
                    LIVE
                  </span>
                  <button
                    onClick={handleFullscreen}
                    className="text-white hover:text-gray-300 cursor-pointer"
                    aria-label="Fullscreen"
                  >
                    ⛶
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg">
          <p className="text-sm text-gray-500 mb-5">Saturday, July 12, 2025</p>
          <h3 className="font-semibold text-gray-700 mb-3 text-lg">
            TV Schedule
          </h3>
          <ul className="text-gray-600 space-y-1 text-sm mb-8">
            {schedule.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChannelPlayer;
