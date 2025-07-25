import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn,
  FaApple,
  FaGooglePlay
} from 'react-icons/fa6';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const aboutLinks = [
    { name: 'About NexGad', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' }
  ];

  const supportLinks = [
    { name: 'Help Center', href: '/help' },
    { name: 'Safety Tips', href: '/safety' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Report a Problem', href: '/report' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: <FaFacebookF />, href: '#', color: 'hover:text-blue-500' },
    { name: 'Twitter', icon: <FaTwitter />, href: '#', color: 'hover:text-sky-500' },
    { name: 'Instagram', icon: <FaInstagram />, href: '#', color: 'hover:text-pink-500' },
    { name: 'LinkedIn', icon: <FaLinkedinIn />, href: '#', color: 'hover:text-blue-600' }
  ];

  return (
    <footer className="bg-[#1B3C53] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-4">NexGad</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                The largest marketplace in Nigeria where buying and selling gadgets is made easy.
              </p>
            </div>
          </div>

          {/* About Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">About</h4>
            <ul className="space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors duration-200 hover:underline"
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors duration-200 hover:underline"
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Connect With Us</h4>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 mb-8">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/70 ${social.color} transition-all duration-200 hover:bg-white/20 hover:scale-110`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Mobile App Download */}
            <div>
              <p className="text-white/80 text-sm mb-4">Download our mobile app</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#"
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 transition-all duration-200 hover:scale-105"
                >
                  <FaApple className="text-xl" />
                  <div className="text-left">
                    <div className="text-xs text-white/60">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 transition-all duration-200 hover:scale-105"
                >
                  <FaGooglePlay className="text-xl" />
                  <div className="text-left">
                    <div className="text-xs text-white/60">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              © {currentYear} NexGad.ng - All Rights Reserved
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <NavLink
                to="/terms"
                className="text-white/60 hover:text-white text-sm transition-colors duration-200"
              >
                Terms of Service
              </NavLink>
              <NavLink
                to="/privacy"
                className="text-white/60 hover:text-white text-sm transition-colors duration-200"
              >
                Privacy Policy
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;