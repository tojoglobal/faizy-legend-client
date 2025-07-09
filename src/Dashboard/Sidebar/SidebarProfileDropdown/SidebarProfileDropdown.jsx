import { useState } from "react";
import { ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const handleLogout = async (navigate) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_OPEN_APIURL}/admin/logout`,
      {},
      { withCredentials: true }
    );
    localStorage.removeItem("userEmail");
    navigate("/admin/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

const SidebarProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const onLogoutClick = () => {
    handleLogout(navigate);
  };

  return (
    <div className="relative p-3">
      {/* Profile Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full cursor-pointer flex items-center justify-between gap-2 bg-white/10 p-2 rounded-lg text-white hover:bg-white/20 transition"
      >
        <div className="flex items-center gap-2">
          <img
            src="https://faizylegend.com/Images/modelingHero.webp"
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-semibold text-sm">admin</span>
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {/* Dropdown Menu */}
      {open && (
        <div className="absolute bottom-14 left-3 w-56 md:w-60 bg-white shadow-lg rounded-lg z-50">
          <div className="p-2">
            {/* <Link to="/dashboard/viewprofile">
              <DropdownItem icon={<User size={16} />} label="Profile" />
            </Link>
            <DropdownItem icon={<MessageSquare size={16} />} label="Messages" /> */}
            {/* <DropdownItem icon={<HelpCircle size={16} />} label="Help" /> */}

            <DropdownItem
              icon={<LogOut size={16} />}
              label="Logout"
              onClick={onLogoutClick}
            />
          </div>
          {/* <div className="border-t" />
          <div className="p-2"> */}
          {/* <DropdownItem
              icon={<CreditCard size={16} />}
              label={
                <span>
                  Balance: <span className="font-semibold">$5971.67</span>
                </span>
              }
            /> */}
          {/* <DropdownItem
              icon={<Settings size={16} />}
              label={
                <span className="flex items-center gap-1">
                  Settings
                  <span className="text-xs bg-blue-500 text-white px-1 rounded">
                    New
                  </span>
                </span>
              }
            /> */}
          {/* <DropdownItem icon={<Lock size={16} />} label="Lock screen" /> */}
          {/* </div> */}
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({ icon, label, onClick }) => (
  <div
    className="flex items-center gap-3 px-3 py-2 text-gray-800 hover:bg-gray-100 rounded cursor-pointer transition"
    onClick={onClick}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);

export default SidebarProfileDropdown;
