import { Outlet, Link } from "react-router-dom";

const TVLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Shared Navbar */}
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
            <button className="bg-blue-600 cursor-pointer px-3 py-1 rounded hover:bg-blue-700">
              Subscribe Now
            </button>
          </div>
        </header>
      </div>

      {/* Dynamic content */}
      <div className="max-w-6xl 2xl:max-w-[1350px] mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default TVLayout;
