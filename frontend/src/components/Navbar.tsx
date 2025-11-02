import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "@/lib/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated());
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated());
  }, []);

  const handleLogout = () => {
    auth.removeToken();
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <>
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-[100] bg-black border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/WhatsApp_Image_2025-11-02_at_3.36.26_AM-removebg-preview.png" alt="VoyageAI" className="h-20 w-auto" />
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                Menu
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="px-4 py-1.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-[#fcaa13] to-[#fb6b10] text-white hover:opacity-90 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
    
    {/* Profile Dropdown */}
    {showDropdown && (
      <div className="fixed top-16 right-6 w-48 backdrop-blur-md bg-black/80 border border-white/20 rounded-xl py-2 shadow-2xl z-[9999]">
        <Link 
          to="/profile" 
          onClick={() => setShowDropdown(false)}
          className="block px-4 py-3 text-gray-200 hover:text-white hover:bg-white/10 transition-colors font-medium"
        >
          👤 View Profile
        </Link>
        <Link 
          to="/trips" 
          onClick={() => setShowDropdown(false)}
          className="block px-4 py-3 text-gray-200 hover:text-white hover:bg-white/10 transition-colors font-medium"
        >
          ✈️ My Trips
        </Link>
        <Link 
          to="/journal" 
          onClick={() => setShowDropdown(false)}
          className="block px-4 py-3 text-gray-200 hover:text-white hover:bg-white/10 transition-colors font-medium"
        >
          📖 Travel Journal
        </Link>
        <Link 
          to="/live-sharing" 
          onClick={() => setShowDropdown(false)}
          className="block px-4 py-3 text-gray-200 hover:text-white hover:bg-white/10 transition-colors font-medium"
        >
          📍 Live Sharing
        </Link>
        <Link 
          to="/reviews" 
          onClick={() => setShowDropdown(false)}
          className="block px-4 py-3 text-gray-200 hover:text-white hover:bg-white/10 transition-colors font-medium"
        >
          ⭐ Reviews
        </Link>
        <Link 
          to="/community" 
          onClick={() => setShowDropdown(false)}
          className="block px-4 py-3 text-gray-200 hover:text-white hover:bg-white/10 transition-colors font-medium"
        >
          🌍 Community
        </Link>
        <Link 
          to="/safety" 
          onClick={() => setShowDropdown(false)}
          className="block px-4 py-3 text-gray-200 hover:text-white hover:bg-white/10 transition-colors font-medium"
        >
          🛡️ Safety Hub
        </Link>
      </div>
    )}
    </>
  );
};

export default Navbar;