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
  const current = channels.find((ch) => ch.name === decodedName);

  const [currentStream, setCurrentStream] = useState(null);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [streamError, setStreamError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetries] = useState(3);

  const playerRef = useRef(null);
  const retryTimeout = useRef(null);
  const controlsTimeout = useRef(null);

  useEffect(() => {
    if (current) {
      setCurrentStream(current.stream);
      setIsLoading(true);
      setStreamError(false);
      setRetryCount(0);
    }
  }, [current]);

  const handleError = () => {
    console.error("Stream error occurred.");
    setIsLoading(false);

    if (current?.backup && currentStream !== current.backup) {
      console.log("Switching to backup stream...");
      setCurrentStream(current.backup);
      setIsLoading(true);
      setStreamError(false);
      setRetryCount(0);
      return;
    }

    if (retryCount < maxRetries) {
      const nextRetry = retryCount + 1;
      console.log(`Retrying stream in 2s... (${nextRetry}/${maxRetries})`);
      retryTimeout.current = setTimeout(() => {
        setIsLoading(true);
        setRetryCount(nextRetry);
        setCurrentStream((prev) => prev);
      }, 2000);
    } else {
      console.log("All retries failed.");
      setStreamError(true);
    }
  };

  const handleReady = () => {
    setIsLoading(false);
    setStreamError(false);
  };

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
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleMouseMove);
    };
  }, []);

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
        <div className="w-full md:w-[65%]">
          <h2 className="text-2xl font-bold mb-2">{decodedName}</h2>
          <div className="bg-black rounded overflow-hidden relative group aspect-video">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-80 text-white text-lg">
                Loading...
              </div>
            )}

            {streamError && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center text-white bg-black/50">
                <div className="text-center p-4">
                  <p className="text-red-500 font-bold mb-2">Stream Error</p>
                  <p>
                    Failed to load the video stream after multiple attempts.
                  </p>
                  <button
                    onClick={() => {
                      setRetryCount(0);
                      setStreamError(false);
                      setIsLoading(true);
                      setCurrentStream(current?.stream);
                    }}
                    className="mt-2 bg-blue-600 px-4 py-1 rounded hover:bg-blue-700"
                  >
                    Retry Stream
                  </button>
                </div>
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

            {currentStream && !isLoading && !streamError && (
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex justify-between items-center transition-opacity duration-300 ${
                  showControls ? "opacity-100" : "opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handlePlayPause}
                    className="text-white hover:text-gray-300"
                  >
                    {playing ? "⏸" : "▶️"}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-gray-300"
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
                    className="w-20 accent-white"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                    LIVE
                  </span>
                  <button
                    onClick={handleFullscreen}
                    className="text-white hover:text-gray-300"
                  >
                    ⛶
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-[35%] bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-600 mb-4">Saturday, July 12, 2025</p>
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
    </div>
  );
};

export default ChannelPlayer;
