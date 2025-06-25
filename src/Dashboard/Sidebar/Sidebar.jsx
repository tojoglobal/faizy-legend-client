import { useEffect, useState } from "react";
import { useLocation, NavLink, Link } from "react-router-dom";
import SidebarProfileDropdown from "./SidebarProfileDropdown/SidebarProfileDropdown";
import {
  Menu,
  X,
  LayoutDashboard,
  ChevronDown,
  ChevronUp,
  Users,
  Layers,
  Drum,
  Tags,
  BookImage,
  Image,
  ShoppingCart,
  BookOpenText,
  Newspaper,
  Palette,
} from "lucide-react";

const logo = "/icon.webp";
const smallLogo = "/icon.webp";

const menuItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    to: "/dashboard",
  },
  {
    label: "Fan Art",
    icon: <Palette size={20} />,
    to: "/dashboard/fanart",
  },
  {
    label: "Modeling Gallery",
    icon: <BookImage size={20} />,
    to: "/dashboard/modeling-gallery",
  },
  {
    label: "Filming Gallery",
    icon: <Image size={20} />,
    to: "/dashboard/filming-gallery",
  },
  {
    label: "Articles",
    icon: <Newspaper size={20} />,
    to: "/dashboard/articles",
  },
  {
    label: "Booking Data",
    icon: <BookOpenText size={20} />,
    to: "/dashboard/booking-data",
  },
  {
    label: "Shopping",
    icon: <ShoppingCart size={20} />,
    to: "/dashboard/shopping",
  },
  {
    label: "UGC",
    icon: <Users size={20} />,
    to: "/dashboard/ugc-gallery",
  },
  {
    label: "Layouts",
    icon: <Layers size={20} />,
    to: "/dashboard/layouts",
  },
];

const Sidebar = ({
  collapsed,
  toggleSidebar,
  mobileOpen,
  toggleMobileSidebar,
}) => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState({});

  useEffect(() => {
    const activeSubmenus = {};
    menuItems.forEach((item) => {
      if (
        item.submenu &&
        item.submenu.some((sub) => location.pathname.startsWith(sub.to))
      ) {
        activeSubmenus[item.label] = true;
      }
    });
    setOpenSubmenus(activeSubmenus);
  }, [location.pathname]);

  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <>
      <div
        className={`bg-gray-800 flex flex-col justify-between fixed md:relative z-[60] transition-all duration-300 ${
          collapsed ? "w-20 pt-5 md:pt-0" : "w-56 md:w-64"
        } h-screen ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Top Fixed Section */}
        <div
          className={`${
            collapsed
              ? "flex items-center justify-center"
              : "flex items-center justify-between"
          } p-4 border-b border-gray-700 shrink-0`}
        >
          <h2
            className={`text-xl font-bold transition-all ${
              collapsed ? "hidden md:block text-center" : ""
            }`}
          >
            {collapsed ? (
              <Link to="/">
                <img src={smallLogo} alt="Logo" className="h-fit" />
              </Link>
            ) : (
              <Link to="/">
                <img src={logo} alt="Logo" className="w-[15%]" />
              </Link>
            )}
          </h2>
          <button
            onClick={toggleSidebar}
            className={`${
              collapsed ? "hidden" : " hidden md:block"
            }  text-white cursor-pointer`}
          >
            <Menu size={20} />
          </button>
          <button
            onClick={toggleMobileSidebar}
            className="md:hidden text-white"
          >
            <X size={20} />
          </button>
        </div>
        {/* Scrollable Menu Section */}
        <div
          className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 px-2 py-2 space-y-1`}
        >
          {menuItems.map(({ label, to, icon, submenu }) => (
            <div key={label} className="relative group">
              {!submenu ? (
                <NavLink
                  key={label}
                  to={to}
                  onClick={mobileOpen ? toggleMobileSidebar : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-1 md:px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive && location.pathname === to
                        ? "bg-teal-600 text-white"
                        : "text-gray-300 hover:bg-teal-700 hover:text-white"
                    }`
                  }
                >
                  <span className="ml-1">{icon}</span>
                  {!collapsed && <span>{label}</span>}
                </NavLink>
              ) : (
                <div>
                  <button
                    onClick={() => toggleSubmenu(label)}
                    className="w-full cursor-pointer flex items-center justify-between gap-2 px-1 md:px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-teal-700 hover:text-white"
                  >
                    <div className="flex items-center gap-3">
                      <span className="ml-1">{icon}</span>
                      {!collapsed && <span>{label}</span>}
                    </div>
                    {!collapsed &&
                      (openSubmenus[label] ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      ))}
                  </button>
                  {/* Submenu */}
                  {(openSubmenus[label] || collapsed) && (
                    <div
                      className={`${
                        collapsed
                          ? "absolute left-full top-1 ml-2 w-48 z-[1000] p-2 rounded bg-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                          : "pl-10 mt-1"
                      } space-y-1`}
                    >
                      {submenu.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={mobileOpen ? toggleMobileSidebar : undefined}
                          className={({ isActive }) =>
                            `block text-sm px-2 py-1 rounded text-gray-300 hover:bg-teal-600 hover:text-white ${
                              isActive ? "bg-teal-600 text-white" : ""
                            }`
                          }
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tooltip when collapsed */}
              {collapsed && (
                <div className="absolute left-full top-1 z-50 ml-2 w-40 p-2 rounded bg-gray-700 text-sm text-white shadow-lg opacity-0 group-hover:opacity-100 transition">
                  {label}
                  {submenu && (
                    <div className="mt-2 space-y-1">
                      {submenu.map((sub) => (
                        <div
                          key={sub.to}
                          className="text-xs text-gray-300 hover:text-white"
                        >
                          {sub.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Profile Section Fixed */}
        <div className="shrink-0">
          {!collapsed && <SidebarProfileDropdown collapsed={collapsed} />}
        </div>
      </div>

      {/* Invisible overlay for handling outside clicks */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
