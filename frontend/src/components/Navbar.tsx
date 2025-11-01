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
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4"
    >
      <div className="
        w-full max-w-4xl
        backdrop-blur-2xl bg-white/5 
        border border-white/20 
 
        rounded-3xl 
        px-6 py-4 
        flex items-center justify-between
        before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-r before:from-white/10 before:to-transparent before:opacity-50
        relative overflow-hidden
      "
    >
      {/* Logo Section */}
      <Link to="/" className="flex items-center">
        <img src="/Wha.png" alt="VoyageAI" className="h-16 w-auto" />
      </Link>

      {/* Nav Buttons */}
      <div className="flex items-center gap-4 relative z-10">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 hover:bg-white/30 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-[#7B4DFF] to-[#FF4BB4] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">U</span>
                </div>
                <span className="text-white text-sm font-medium">Profile</span>
                <span className="text-white/60 text-xs">▼</span>
              </button>
              

            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link
              to="/signin"
              className="px-5 py-2 rounded-full text-sm font-medium text-white/80 hover:text-white transition-colors relative z-10"
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              className="px-5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-[#7B4DFF] to-[#FF4BB4] text-white hover:opacity-90 transition-all relative z-10"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </div>
    </motion.nav>
    
    {/* Profile Dropdown - Outside navbar for proper overlap */}
    {showDropdown && (
      <div className="fixed top-20 right-8 w-48 bg-white border border-gray-200 rounded-xl py-2 shadow-2xl z-[9999]">
        <Link 
          to="/profile" 
          onClick={() => setShowDropdown(false)}
          className="block px-4 py-3 text-gray-800 hover:text-black hover:bg-gray-100 transition-colors font-medium"
        >
          👤 View Profile
        </Link>
        <Link 
          to="/trips" 
          onClick={() => setShowDropdown(false)}
          className="block px-4 py-3 text-gray-800 hover:text-black hover:bg-gray-100 transition-colors font-medium"
        >
          ✈️ My Trips
        </Link>
        <Link 
          to="/journal" 
          onClick={() => setShowDropdown(false)}
          className="block px-4 py-3 text-gray-800 hover:text-black hover:bg-gray-100 transition-colors font-medium"
        >
          📖 Travel Journal
        </Link>
        <Link 
          to="/live-sharing" 
          onClick={() => setShowDropdown(false)}
          className="block px-4 py-3 text-gray-800 hover:text-black hover:bg-gray-100 transition-colors font-medium"
        >
          📍 Live Sharing
        </Link>
        <Link 
          to="/reviews" 
          onClick={() => setShowDropdown(false)}
          className="block px-4 py-3 text-gray-800 hover:text-black hover:bg-gray-100 transition-colors font-medium"
        >
          ⭐ Reviews
        </Link>
        <Link 
          to="/community" 
          onClick={() => setShowDropdown(false)}
          className="block px-4 py-3 text-gray-800 hover:text-black hover:bg-gray-100 transition-colors font-medium"
        >
          🌍 Community
        </Link>
        <Link 
          to="/safety" 
          onClick={() => setShowDropdown(false)}
          className="block px-4 py-3 text-gray-800 hover:text-black hover:bg-gray-100 transition-colors font-medium"
        >
          🛡️ Safety Hub
        </Link>
      </div>
    )}
    </>
  );
};

export default Navbar;