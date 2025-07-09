import { Link, Outlet } from "react-router-dom";

const ComicLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[BAC1C8] to-[DEE6EF] text-white p-6">
      <div className="max-w-6xl mx-auto 2xl:max-w-[1360px] font-sans">
        <nav className="flex gap-6 mb-8 text-sm text-gray-300">
          <Link to="/" className="hover:text-white">
            Faizy Legend
          </Link>
          <Link to="/faizycomic/comics" className="hover:text-white">
            Comic
          </Link>
          <a
            href="https://www.tojoglobal.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            Shop
          </a>
        </nav>
        <h1 className="text-center text-xl lg:text-2xl roboto-condensed text-lime-400 font-bold mb-6">
          FAÏZY COMIC
        </h1>
        <Outlet />
      </div>
    </div>
  );
};

export default ComicLayout;
