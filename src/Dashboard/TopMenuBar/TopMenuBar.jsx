import React from "react";
import {
  Menu,
  Bell,
  Search,
  Settings,
  Maximize2,
  Sun,
  Moon,
} from "lucide-react";
// import { useAppContext } from "../../context/useAppContext";

const TopMenuBar = ({ toggleMobileSidebar, collapsed, toggleSidebar }) => {
  // const { darkMode, toggleDarkMode } = useAppContext();
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <div className="flex justify-between items-center px-4 py-[10px] shadow  w-full">
      {/* Left Side: Menu Icon and Dashboard Text */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleMobileSidebar}
          className="cursor-pointer md:hidden"
        >
          <Menu size={24} />
        </button>
        {collapsed ? (
          <button
            onClick={toggleSidebar}
            className="cursor-pointer hidden md:block"
          >
            <Menu size={24} />
          </button>
        ) : null}
        <span className="text-xl font-bold text-white dark:text-white tracking-wide">
          Dashboard
        </span>
      </div>

      {/* Right Side: Search Bar, Notifications, Fullscreen, Settings */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-700 w-52 dark:bg-gray-800 text-sm text-white dark:text-white px-3 py-[5px] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Search
              size={16}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400"
            />
          </div>
        </div>
        {/* Notification Icon */}
        <button className="relative cursor-pointer text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white">
          <Bell size={22} />
          <span className="absolute top-0 right-0 inline-block w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        </button>
        {/* Fullscreen Icon */}
        <button
          onClick={handleFullscreen}
          className="text-gray-300 cursor-pointer dark:text-gray-400 hover:text-white dark:hover:text-white"
        >
          <Maximize2 size={21} />
        </button>
        {/* Dark Mode Toggle */}
        {/* <button
          onClick={toggleDarkMode}
          className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button> */}

        {/* Settings Icon */}
        <button className="text-gray-300 cursor-pointer dark:text-gray-400 hover:text-white dark:hover:text-white">
          <Settings size={23} />
        </button>
      </div>
    </div>
  );
};

export default TopMenuBar;
