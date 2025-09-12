import { Heart, LogOut, Rotate3d, SendHorizontal, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogoutRequest } from "../utils/LogoutLogic";
import { useAppContext } from "../context/AppContext";

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  address1: string;
  address2: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userData } = useAppContext()
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!userData) {
    return null;
  }

  const initials = `${userData.firstName.charAt(0)}${userData.lastName.charAt(
    0
  )}`.toUpperCase();

  const handleNavigation = (routeKey: string) => {
    switch (routeKey) {
      case "userprofile":
        navigate("/userprofile");
        break;
      case "orders":
        navigate("/my-orders");
        break;
      case "wishlist":
        navigate("/wishlist");
        break;
      case "gadget-request":
        navigate("/gadget-request");
        break;
      case "logout":
        // Optional logout logic
        LogoutRequest();
        break;
      default:
        console.warn("Unknown route:", routeKey);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center space-x-3 text-[#1B3C53] hover:text-[#456882] transition-colors duration-200 focus:outline-none"
      >
        {/* Greeting Text */}
        <span className="text-sm font-medium hidden sm:block">
          Hi, {userData.lastName} {userData.firstName}
        </span>

        {/* Profile Picture */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-[#456882] text-white flex items-center justify-center text-xs font-semibold border-2 border-[#CBDCEB] hover:border-[#456882] transition-colors duration-200">
            {initials}
          </div>

          {/* Online Status Indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#CBDCEB] rounded-lg shadow-lg py-2 z-50"
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* User Info Header */}
          <div className="px-4 py-2 border-b border-[#CBDCEB]">
            <p className="text-sm font-semibold text-[#1B3C53]">
              {userData.firstName} {userData.lastName}
            </p>
            {userData.email && (
              <p className="text-xs text-[#456882]/70 truncate">
                {userData.email}
              </p>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={() => {
                handleNavigation("userprofile");
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-[#1B3C53] hover:bg-[#CBDCEB]/50 transition-colors duration-150"
            >
              <User className="w-4 h-4 mr-3 text-[#456882]" />
              My Profile
            </button>

            <button
              onClick={() => {
                handleNavigation("orders");
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-[#1B3C53] hover:bg-[#CBDCEB]/50 transition-colors duration-150"
            >
              <Rotate3d className="w-4 h-4 mr-3 text-[#456882]" />
              Orders
            </button>

            <button
              onClick={() => {
                handleNavigation("wishlist");
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-[#1B3C53] hover:bg-[#CBDCEB]/50 transition-colors duration-150"
            >
              <Heart className="w-4 h-4 mr-3 text-[#456882]" />
              Wishlist
            </button>

            <button
              onClick={() => {
                handleNavigation("gadget-request");
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-[#1B3C53] hover:bg-[#CBDCEB]/50 transition-colors duration-150"
            >
              <SendHorizontal className="w-4 h-4 mr-3 text-[#456882]" />
              Gadget Request
            </button>

            <button
              onClick={() => {
                handleNavigation("logout");
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-[#1B3C53] hover:bg-[#CBDCEB]/50 transition-colors duration-150"
            >
              <LogOut className="w-4 h-4 mr-3 text-[#456882]" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
