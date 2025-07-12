import { useParams, Link } from "react-router-dom";
import ReactPlayer from "react-player";
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
  const stream = current?.stream || "";
  const backup = current?.backup || "";

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* Navbar */}
      <header className="bg-black text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">TheTVApp</h1>
        <div className="space-x-4 text-sm">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <button className="border px-3 py-1 rounded hover:bg-white hover:text-black transition">
            Contact Us
          </button>
          <button className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">
            Subscribe Now
          </button>
        </div>
      </header>
      <main className="p-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Player - 65% */}
          <div className="w-full md:w-[65%]">
            <h2 className="text-2xl font-bold mb-2">{decodedName}</h2>
            <div className="bg-black rounded overflow-hidden">
              <ReactPlayer
                url={stream}
                controls
                playing
                width="100%"
                height="100%"
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
                onError={(e) => {
                  console.log(e);
                  if (backup) {
                    window.location.href = backup;
                  }
                }}
              />
            </div>
          </div>

          {/* Details - 35% */}
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
