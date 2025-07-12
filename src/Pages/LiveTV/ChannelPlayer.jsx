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
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentStream, setCurrentStream] = useState(null);
  const [streamError, setStreamError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const controlsTimeout = useRef(null);

  const current = channels.find((ch) => ch.name === decodedName);

  // Initialize stream source
  useEffect(() => {
    if (current) {
      setIsLoading(true);
      setStreamError(false);
      setCurrentStream(current.stream);
      setPlaying(true);
    }
  }, [current]);

  const handleError = (e) => {
    console.error("Stream error:", e);
    setIsLoading(false);
    setStreamError(true);

    if (current?.backup && currentStream !== current.backup) {
      console.log("Attempting backup stream...");
      setCurrentStream(current.backup);
      setPlaying(true);
      setIsLoading(true);
    }
  };

  const handleReady = () => {
    console.log("Player ready");
    setIsLoading(false);
    setStreamError(false);
  };

  // Hide controls after 3 seconds of inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimeout.current);
      controlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    handleMouseMove();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleMouseMove);
      clearTimeout(controlsTimeout.current);
    };
  }, []);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setMuted(true);
    } else {
      setMuted(false);
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

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

  return (
    <div className="min-h-screen p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Player - 65% */}
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
                  <p>Failed to load the video stream</p>
                  {current?.backup && (
                    <button
                      onClick={() => {
                        setCurrentStream(current.backup);
                        setIsLoading(true);
                        setStreamError(false);
                      }}
                      className="mt-2 bg-blue-600 px-4 py-1 rounded hover:bg-blue-700"
                    >
                      Try Backup Stream
                    </button>
                  )}
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
                      xhrSetup: (xhr) => {
                        xhr.withCredentials = false;
                      },
                    },
                  },
                }}
              />
            )}

            {/* Custom controls overlay */}
            {currentStream && !isLoading && !streamError && (
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex justify-between items-center transition-opacity duration-300 ${
                  showControls ? "opacity-100" : "opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center space-x-4">
                  <button
                    className="text-white hover:text-gray-300"
                    onClick={handlePlayPause}
                  >
                    {playing ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      className="text-white hover:text-gray-300"
                      onClick={toggleMute}
                    >
                      {muted || volume === 0 ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                            clipRule="evenodd"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 011.414 1.414"
                          />
                        </svg>
                      )}
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
                </div>
                <div className="flex items-center space-x-2">
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                    LIVE
                  </span>
                  <button className="text-white hover:text-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </button>
                  <button className="text-white hover:text-gray-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  </button>
                  <button
                    className="text-white hover:text-gray-300"
                    onClick={handleFullscreen}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Details - 35% */}
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
