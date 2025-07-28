import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';

interface UserData {
  firstName: string;
  lastName: string;
  profilePicture?: string;
  email?: string;
}

interface UserProfileDropdownProps {
  onProfileClick?: () => void;
  onLogout?: () => void;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  onProfileClick,
  onLogout
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Simulate getting user data from localStorage
  useEffect(() => {
    // Replace this with your actual auth logic
    const authData = localStorage.getItem('auth');
    if (authData) {
      try {
        const parsedAuth = JSON.parse(authData);
        setUserData({
          firstName: parsedAuth.firstName || 'Anjiorin',
          lastName: parsedAuth.lastName || 'Favour',
          profilePicture: parsedAuth.profilePicture,
          email: parsedAuth.email
        });
      } catch (error) {
        console.error('Error parsing auth data:', error);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsOpen(false);
    if (onProfileClick) {
      onProfileClick();
    }
  };

  const handleLogout = () => {
    setIsOpen(false);
    // Clear auth from localStorage
    localStorage.removeItem('auth');
    if (onLogout) {
      onLogout();
    }
  };

  // Don't render if no user data
  if (!userData) {
    return null;
  }

  // Generate initials for fallback avatar
  const initials = `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();

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
          {userData.profilePicture ? (
            <img
              src={userData.profilePicture}
              alt={`${userData.firstName} ${userData.lastName}`}
              className="w-8 h-8 rounded-full object-cover border-2 border-[#CBDCEB] hover:border-[#456882] transition-colors duration-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#456882] text-white flex items-center justify-center text-xs font-semibold border-2 border-[#CBDCEB] hover:border-[#456882] transition-colors duration-200">
              {initials}
            </div>
          )}
          
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
              onClick={handleProfileClick}
              className="w-full flex items-center px-4 py-2 text-sm text-[#1B3C53] hover:bg-[#CBDCEB]/50 transition-colors duration-150"
            >
              <User className="w-4 h-4 mr-3 text-[#456882]" />
              My Profile
            </button>
            
            <button
              onClick={handleLogout}
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