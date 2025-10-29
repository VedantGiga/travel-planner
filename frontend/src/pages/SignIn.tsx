"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "@/lib/auth";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await auth.signin(email, password);
      auth.setToken(response.token);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0A0A0B] text-[#EAEAEA] overflow-hidden">
      {/* Left Visual Section */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="hidden md:flex flex-col justify-center items-center w-1/2 p-12 border-r border-white/10 relative"
      >
        <motion.img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="Travel landscape"
          className="object-cover w-[500px] h-[350px] grayscale brightness-90 contrast-125"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
        />

        <h1 className="mt-10 text-4xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-[#2A7FFF] via-[#D63E6D] to-[#3D7A41] bg-clip-text text-transparent">
            Welcome Back, Explorer
          </span>
        </h1>
        <p className="mt-3 text-[#9CA3AF] max-w-md text-center leading-relaxed">
          Continue your AI-powered journey planning — your next destination awaits.
        </p>
      </motion.div>

      {/* Right Form Section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-10 relative">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="w-full max-w-md bg-[#121214] border border-white/10 p-10 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
        >
          <h2 className="text-2xl font-medium mb-1">Sign in</h2>
          <p className="text-[#9CA3AF] mb-8 text-sm">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-[#2A7FFF] hover:text-[#D63E6D] transition">
              Sign up
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-[#D63E6D] text-sm border border-[#D63E6D]/30 bg-[#D63E6D]/10 px-3 py-2">
                {error}
              </div>
            )}
            <div>
              <label className="text-xs uppercase tracking-wider text-[#9CA3AF] mb-2 block">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 bg-transparent border border-white/20 text-[#EAEAEA] text-sm focus:border-[#2A7FFF] outline-none transition"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#9CA3AF] mb-2 block">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 bg-transparent border border-white/20 text-[#EAEAEA] text-sm focus:border-[#2A7FFF] outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <div className="text-right mt-2">
                <Link to="/forgot-password" className="text-[#D63E6D] text-xs hover:text-[#2A7FFF]">
                  Forgot password?
                </Link>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              className="w-full py-2.5 bg-gradient-to-r from-[#2A7FFF] via-[#D63E6D] to-[#3D7A41] text-white text-sm font-medium tracking-wide transition disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </motion.button>

            <div className="flex items-center gap-2 text-[#9CA3AF] mt-6 text-xs">
              <div className="h-px flex-1 bg-white/10"></div>
              <span>OR</span>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            <button className="mt-3 w-full py-2.5 bg-transparent border border-white/20 hover:border-[#2A7FFF]/50 flex items-center justify-center gap-2 text-sm text-[#EAEAEA] transition">
              <img src="/google-icon.svg" alt="Google" className="w-4 h-4" />
              Continue with Google
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
