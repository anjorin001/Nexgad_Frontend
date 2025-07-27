import { NavLink } from "react-router-dom";
import { FaBars, FaRegCommentDots, FaXmark } from "react-icons/fa6";
import { useState } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-white shadow-lg border-b-2 border-[#1B3C53]/20 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Browse */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <NavLink
                to="/"
                className="text-xl font-bold text-[#1B3C53] hover:text-[#456882] transition-colors duration-200"
              >
                NexGad
              </NavLink>
            </div>

            {/* Desktop Browse Categories */}
            <div className="hidden lg:flex items-center space-x-2 bg-[#CBDCEB] px-4 py-2 rounded-lg hover:bg-[#456882]/10 transition-colors duration-200">
              <FaBars className="text-[#1B3C53] text-sm" />
              <NavLink
                to="/listings"
                className="text-[#1B3C53] text-sm font-medium hover:text-[#456882] transition-colors duration-200"
              >
                Browse Categories
              </NavLink>
            </div>
          </div>

          {/* Desktop Auth Links */}
          <div className="hidden md:flex items-center space-x-4">
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
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-[#1B3C53] hover:bg-[#F9F3EF] transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <FaXmark className="w-5 h-5" />
              ) : (
                <FaBars className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#1B3C53]/20 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Browse Categories */}
              <NavLink
                to="/listings"
                className="flex items-center space-x-2 text-[#1B3C53] hover:text-[#456882] hover:bg-[#7da5d3] px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaBars className="text-sm" />
                <span>Browse Categories</span>
              </NavLink>

              {/* Mobile Auth Links */}
              <NavLink
                to="/login"
                className="flex items-center space-x-2 text-[#1B3C53] hover:text-[#456882] hover:bg-[#7da5d3] px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaRegCommentDots className="text-sm" />
                <span>Sign in</span>
              </NavLink>

              <NavLink
                to="/register"
                className="block bg-[#1B3C53] text-white px-3 py-2 rounded-lg hover:bg-[#456882] transition-all duration-200 text-sm font-medium text-center mx-2 mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign up
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
