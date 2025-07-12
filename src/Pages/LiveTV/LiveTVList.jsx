import { Link } from "react-router-dom";
import channels from "./channels";
import { Helmet } from "react-helmet";

const LiveTVList = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Live TV | Faizy Legend</title>
      </Helmet>
      {/* Navbar */}
      <div className="bg-black text-white">
        <header className="max-w-6xl 2xl:max-w-[1350px] mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">TheTVApp</h1>
          <div className="space-x-4 text-sm">
            <Link to="/">Home</Link>
            <button className="border cursor-pointer px-3 py-1 rounded hover:bg-white hover:text-black transition">
              Contact Us
            </button>
            <button className="bg-blue-600 cursor-pointer px-3 py-1 rounded hover:bg-blue-700">
              Subscribe Now
            </button>
          </div>
        </header>
      </div>

      {/* List Section */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Live TV Channels</h2>
        <div className="border rounded overflow-auto max-h-[80vh]">
          <ol className="divide-y text-black">
            {channels.map((ch, index) => (
              <li key={ch.name} className="p-3 hover:bg-gray-100">
                <Link
                  to={`/tv/${encodeURIComponent(ch.name)}`}
                  className="block"
                >
                  {index + 1}. {ch.name}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </main>
    </div>
  );
};

export default LiveTVList;
