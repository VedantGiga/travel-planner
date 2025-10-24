import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "@/lib/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = auth.isAuthenticated();

  const handleLogout = () => {
    auth.removeToken();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
    >
      <div className="
        w-full max-w-4xl
        backdrop-blur-2xl bg-white/5 
        border border-white/20 
        shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] 
        rounded-3xl 
        px-6 py-4 
        flex items-center justify-between
        before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-r before:from-white/10 before:to-transparent before:opacity-50
        relative overflow-hidden
      "
    >
      {/* Logo Section */}
      <Link to="/" className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#7B4DFF] to-[#FF4BB4] flex items-center justify-center text-white font-bold">
          <span>V</span>
        </div>
        <span className="text-white text-lg font-semibold tracking-wide">
          VoyageMind
        </span>
      </Link>

      {/* Nav Buttons */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-full text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/signin"
              className="px-5 py-2 rounded-full text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              className="px-5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-[#7B4DFF] to-[#FF4BB4] text-white hover:opacity-90 transition-all"
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