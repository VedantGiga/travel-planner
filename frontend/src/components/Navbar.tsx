import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "@/lib/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated());

  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated());
  }, []);

  const handleLogout = () => {
    auth.removeToken();
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
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
        <img src="/download.png" alt="VoyageMind" className="h-20 w-20" />
      </Link>

      {/* Nav Buttons */}
      <div className="flex items-center gap-4 relative z-10">
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-full text-sm font-medium text-white/80 hover:text-white transition-colors relative z-10 cursor-pointer"
          >
            Logout
          </button>
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
  );
};

export default Navbar;