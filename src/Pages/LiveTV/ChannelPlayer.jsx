import { useParams, Link } from "react-router-dom";
import ReactPlayer from "react-player";
import { useState, useRef, useEffect, useCallback } from "react";
import channels from "./channels";

// Function to generate a more generic and professional-looking schedule
const generateDynamicSchedule = () => {
  const now = new Date();
  const scheduleItems = [];
  const genericProgramTitles = [
    "Channel Programming",
    "Scheduled Broadcast",
    "Featured Content",
    "Special Presentation",
    "Informational Segment",
    "Entertainment Block",
    "Current Affairs Analysis",
    "Thematic Discussions",
    "Discovery Hour",
    "Cultural Showcase",
    "Lifestyle Program",
    "Music Selection",
    "Science & Technology Focus",
    "Health & Wellness",
    "Documentary Feature",
    "Classic Replay",
  ];

  // Start the schedule from the current hour, showing 4 upcoming slots
  for (let i = 0; i < 4; i++) {
    // Generate fewer, more focused items
    const programStartTime = new Date(now.getTime());
    programStartTime.setMinutes(now.getMinutes() + i * 35); // Approx 35-minute intervals
    const timeString = programStartTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const title =
      genericProgramTitles[
        Math.floor(Math.random() * genericProgramTitles.length)
      ];
    scheduleItems.push(`${timeString} - ${title}`); // Simplified format
  }
  return scheduleItems;
};

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isSeekable, setIsSeekable] = useState(false);
  const maxRetries = 3;

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const retryTimeout = useRef(null);
  const controlsTimeout = useRef(null);
  const updateTimeout = useRef(null);

  const currentChannel = channels.find((ch) => ch.name === decodedName);

  const [currentDate, setCurrentDate] = useState("");
  const [dynamicSchedule, setDynamicSchedule] = useState([]);

  useEffect(() => {
    // Set current date (localized for Bangladesh)
    const today = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Dhaka", // Specify time zone for Bangladesh
    };
    setCurrentDate(today.toLocaleDateString("en-US", options));

    // Generate dynamic schedule
    setDynamicSchedule(generateDynamicSchedule());

    if (!currentChannel) {
      setStreamError(true);
      setIsLoading(false);
      return;
    }

    setIsSeekable(
      currentChannel.type === "recorded" || currentChannel.isYoutube
    );

    setIsLoading(true);
    setStreamError(false);
    setPlayed(0);
    setDuration(0);

    clearTimeout(updateTimeout.current);
    updateTimeout.current = setTimeout(() => {
      setCurrentStream(currentChannel.stream);
      setRetryCount(0);
    }, 300);

    return () => clearTimeout(updateTimeout.current);
  }, [decodedName, currentChannel]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleError = () => {
    setIsLoading(false);

    if (currentChannel?.backup && currentStream !== currentChannel.backup) {
      setCurrentStream(currentChannel.backup);
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
    if (playerRef.current && isSeekable) {
      setDuration(playerRef.current.getDuration());
    }
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
      clearTimeout(updateTimeout.current);
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

  const handleFullscreen = async () => {
    try {
      if (!playerContainerRef.current) return;

      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await playerContainerRef.current.requestFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  const handleProgress = useCallback(
    (state) => {
      if (!seeking && isSeekable) {
        setPlayed(state.played);
      }
    },
    [seeking, isSeekable]
  );

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    if (playerRef.current && isSeekable) {
      playerRef.current.seekTo(parseFloat(e.target.value));
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === Infinity) return "00:00";
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = String(date.getUTCSeconds()).padStart(2, "0");
    if (hh) {
      return `${hh}:${String(mm).padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  return (
    <div className="min-h-screen p-4">
      <div className="flex flex-col md:flex-row gap-6 mt-2">
        {/* Player Section */}
        <div className="w-full md:w-2/3">
          <div className="mb-5">
            <Link
              to="/tv"
              className="inline-flex items-center text-blue-600 hover:underline text-base font-medium mb-1"
            >
              ← Back to LiveTV
            </Link>
            <h2 className="text-3xl font-bold text-gray-800">{decodedName}</h2>
          </div>
          <div
            ref={playerContainerRef}
            className="relative bg-black rounded-lg overflow-hidden aspect-video shadow-lg"
          >
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
                    setCurrentStream(currentChannel?.stream || null);
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
                onProgress={handleProgress}
                onDuration={setDuration}
                config={{
                  file: {
                    forceHLS: true,
                    hlsOptions: {
                      xhrSetup: (xhr) => (xhr.withCredentials = false),
                    },
                  },
                  youtube: {
                    playerVars: {
                      modestbranding: 1,
                      rel: 0,
                      showinfo: 0,
                    },
                  },
                }}
              />
            )}
            {/* Controls */}
            {currentStream && !isLoading && !streamError && (
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col transition-opacity duration-300 ${
                  showControls ? "opacity-100" : "opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Seek Bar - Conditionally Rendered */}
                {isSeekable && (
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="any"
                    value={played}
                    onMouseDown={handleSeekMouseDown}
                    onChange={handleSeekChange}
                    onMouseUp={handleSeekMouseUp}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mb-2 accent-red-600"
                    style={{
                      background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${
                        played * 100
                      }%, #4b5563 ${played * 100}%, #4b5563 100%)`,
                    }}
                  />
                )}

                <div className="flex justify-between items-center w-full">
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
                    {/* Time Display - Conditionally Rendered */}
                    {isSeekable ? (
                      <span className="text-white text-sm font-mono">
                        {formatTime(played * duration)} / {formatTime(duration)}
                      </span>
                    ) : (
                      <span className="bg-red-600 text-white text-xs px-3 py-1 rounded font-semibold tracking-wide select-none">
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleFullscreen}
                      className="text-white hover:text-gray-300 cursor-pointer"
                      aria-label={
                        isFullscreen ? "Exit fullscreen" : "Fullscreen"
                      }
                    >
                      {isFullscreen ? "⛶" : "⛶"}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {isFullscreen && (
              <button
                onClick={handleFullscreen}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full z-30 md:hidden"
                aria-label="Exit fullscreen"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg flex flex-col shadow-lg">
          {/* Dynamically display current date */}
          <div className="flex-grow">
            <p className="text-sm text-gray-500 mb-5">{currentDate}</p>
            <h3 className="font-semibold text-gray-700 mb-3 text-lg">
              Upcoming Programs
            </h3>
            {/* Changed heading to be more general */}
            <ul className="text-gray-600 space-y-1 text-sm mb-8">
              {/* Render dynamic schedule */}
              {dynamicSchedule.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <footer className="text-xs text-gray-400">
            Developed by{" "}
            <a
              href="https://www.tojoglobal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:text-indigo-600 font-semibold transition-colors"
            >
              TOJO Global
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ChannelPlayer;
