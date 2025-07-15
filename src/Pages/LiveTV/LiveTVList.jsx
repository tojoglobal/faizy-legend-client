import { Link } from "react-router-dom";
import channels from "./channels";
import { Helmet } from "react-helmet";

const LiveTVList = () => {
  const liveChannels = channels.filter(
    (ch) => ch.type === "live" && !ch.isYoutube
  );
  const recordedChannels = channels.filter(
    (ch) => ch.type === "recorded" && !ch.isYoutube
  );
  const youtubeChannels = channels.filter((ch) => ch.isYoutube);

  const renderSection = (title, list) => (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <div className="border rounded overflow-auto max-h-[60vh]">
        <ol className="divide-y text-black">
          {list.map((ch, index) => (
            <li key={ch.name} className="p-3 hover:bg-gray-100">
              <Link to={`/tv/${encodeURIComponent(ch.name)}`} className="block">
                {index + 1}. {ch.name}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Live TV | Faizy Legend</title>
      </Helmet>
      <main className="max-w-5xl mx-auto px-4 py-6">
        {renderSection("Live TV Channels", liveChannels)}
        {renderSection("Recorded Channels", recordedChannels)}
        {renderSection("YouTube Channels", youtubeChannels)}
      </main>
    </div>
  );
};

export default LiveTVList;
