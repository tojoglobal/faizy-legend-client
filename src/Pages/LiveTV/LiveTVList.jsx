import { Link } from "react-router-dom";
import channels from "./channels";
import { Helmet } from "react-helmet";

const LiveTVList = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Live TV | Faizy Legend</title>
      </Helmet>
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
