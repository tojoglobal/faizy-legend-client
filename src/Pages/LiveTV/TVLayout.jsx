import { Outlet, Link } from "react-router-dom";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const TVLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white relative">
      {/* Shared Navbar */}
      <div className="bg-black text-white fixed top-0 left-0 right-0 z-50 shadow-md">
        <header className="max-w-6xl 2xl:max-w-[1350px] mx-auto px-6 py-4 md:py-5 flex justify-between items-center">
          <Link to="/tv" onClick={() => setMobileMenuOpen(false)}>
            <h1 className="text-2xl font-bold">TheTVApp</h1>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6 text-sm items-center">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:underline"
            >
              Home
            </Link>
            <button className="border px-3 py-1 cursor-pointer rounded hover:bg-white hover:text-black transition">
              Contact Us
            </button>
            <button className="bg-blue-600 cursor-pointer px-3 py-1 rounded hover:bg-blue-700 transition">
              Subscribe Now
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex cursor-pointer items-center justify-center p-2 rounded-md text-white hover:text-gray-300 hover:bg-gray-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </header>

        {/* Mobile Menu Dropdown */}
        <nav
          className={`md:hidden fixed top-[64px] left-0 right-0 bg-black shadow-lg z-40 transform transition-transform duration-300 origin-top ${
            mobileMenuOpen ? "scale-y-100" : "scale-y-0"
          }`}
          style={{ transformOrigin: "top" }}
        >
          <div className="flex flex-col px-6 py-4 space-y-3 text-sm">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block border px-3 py-2 rounded hover:underline"
            >
              Home
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left border px-3 py-2 rounded hover:bg-white hover:text-black transition"
            >
              Contact Us
            </button>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-blue-600 px-3 py-2 rounded hover:bg-blue-700 transition"
            >
              Subscribe Now
            </button>
          </div>
        </nav>
      </div>
      <div className="h-16 md:h-20" />

      {/* Dynamic content */}
      <main className="max-w-6xl 2xl:max-w-[1350px] mx-auto p-2 relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default TVLayout;
