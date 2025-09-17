import { Heart, LogOut, Rotate3d, SendHorizontal, User } from "lucide-react";
import { useState } from "react";
import { FaBars, FaRegCommentDots, FaShoppingCart } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { LogoutRequest } from "../utils/LogoutLogic";
import UserProfileDropdown from "./UserProfileDropdown";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setIsAuthenticated, isAuthenticated, cart } = useAppContext();

  const cartItemCount = cart?.items?.length || 0;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg border-b-2 border-[#1B3C53]/20 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <NavLink
                to="/"
                className="text-xl font-bold text-[#1B3C53] hover:text-[#456882] transition-colors duration-200"
              >
                NexGad
              </NavLink>
            </div>

            {/* Browse Categories */}
            <div className="hidden md:flex items-center space-x-2 bg-[#CBDCEB] px-4 py-2 rounded-lg hover:bg-[#456882]/10 transition-colors duration-200 cursor-pointer">
              <FaBars className="text-[#1B3C53] text-sm" />
              <NavLink
                to="/listings"
                className="text-[#1B3C53] text-sm font-medium hover:text-[#456882] transition-colors duration-200"
              >
                Browse Categories
              </NavLink>
            </div>
          </div>

          {/* Desktop Navigation*/}

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink
              to="/cart"
              className="relative flex items-center justify-center p-2 text-[#1B3C53] hover:text-[#456882] hover:bg-[#DDE6ED] rounded-lg transition-all duration-200"
              title="Shopping Cart"
            >
              <FaShoppingCart className="text-lg" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </NavLink>

            {isAuthenticated ? (
              <UserProfileDropdown />
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="flex items-center space-x-2 text-[#1B3C53] hover:text-[#456882] px-3 py-2 rounded-lg hover:bg-[#F9F3EF] transition-all duration-200 font-medium"
                >
                  <FaRegCommentDots className="text-sm" />
                  <span>Sign in</span>
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-[#1B3C53] text-white px-6 py-2 rounded-lg hover:bg-[#456882] transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Sign up
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-[#1B3C53] hover:bg-[#F9F3EF] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1B3C53]/20"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <FaXmark className="w-5 h-5" />
              ) : (
                <FaBars className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Improved Layout */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="border-t border-[#1B3C53]/20 bg-white">
            <div className="px-2 pt-4 pb-4 space-y-3">
              {/* Mobile Browse Categories - First */}
              <NavLink
                to="/listings"
                className="flex items-center space-x-3 text-[#1B3C53] hover:text-[#456882] hover:bg-[#CBDCEB] px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 border border-transparent hover:border-[#456882]/20"
                onClick={closeMobileMenu}
              >
                <FaBars className="text-sm" />
                <span>Browse Categories</span>
              </NavLink>

              <div className="space-y-2">
                <NavLink
                  to="/cart"
                  className="flex items-center justify-between text-[#1B3C53] hover:text-[#456882] hover:bg-[#DDE6ED] px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
                  onClick={closeMobileMenu}
                >
                  <div className="flex items-center space-x-3">
                    <FaShoppingCart className="text-sm" />
                    <span>Shopping Cart</span>
                  </div>
                  {cartItemCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  )}
                </NavLink>
              </div>

              {/* Mobile Auth Section - Last */}
              <div className="pt-4 border-t border-[#1B3C53]/20 space-y-3">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <NavLink
                      to="/userprofile"
                      className="flex items-center space-x-3 text-[#1B3C53] hover:text-[#456882] hover:bg-[#F9F3EF] px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      <User className="text-sm" />
                      <span>My Profile</span>
                    </NavLink>

                    <NavLink
                      to="/my-orders"
                      className="flex items-center space-x-3 text-[#1B3C53] hover:text-[#456882] hover:bg-[#F9F3EF] px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      <Rotate3d className="text-sm" />
                      <span>Orders</span>
                    </NavLink>

                    <NavLink
                      to="/wishlist"
                      className="flex items-center space-x-3 text-[#1B3C53] hover:text-[#456882] hover:bg-[#F9F3EF] px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      <Heart className="text-sm" />
                      <span>Wishlist</span>
                    </NavLink>

                    <NavLink
                      to="/gadget-request"
                      className="flex items-center space-x-3 text-[#1B3C53] hover:text-[#456882] hover:bg-[#F9F3EF] px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      <SendHorizontal className="text-sm" />
                      <span>Gadget Request</span>
                    </NavLink>
                    <button
                      className="flex items-center space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
                      onClick={() => {
                        LogoutRequest(setIsAuthenticated);
                      }}
                    >
                      <LogOut className="text-sm" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <NavLink
                      to="/login"
                      className="flex items-center justify-center space-x-3 text-[#1B3C53] hover:text-[#456882] hover:bg-[#F9F3EF] px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 border border-[#1B3C53] hover:border-[#456882]"
                      onClick={closeMobileMenu}
                    >
                      <FaRegCommentDots className="text-sm" />
                      <span>Sign in</span>
                    </NavLink>

                    <NavLink
                      to="/register"
                      className="block bg-[#1B3C53] text-white px-4 py-3 rounded-lg hover:bg-[#456882] transition-all duration-200 text-base font-medium text-center shadow-md hover:shadow-lg transform hover:scale-105"
                      onClick={closeMobileMenu}
                    >
                      Sign up
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
