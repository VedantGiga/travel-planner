import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    
    try {
      const response = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      
      if (response.ok) {
        setMessage("Password reset successful! Redirecting to sign in...");
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to reset password");
      }
    } catch (err: any) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-[#2A7FFF] via-[#3D7A41] to-[#7440A3] overflow-hidden text-white relative">
      <div className="absolute inset-0">
        <div className="absolute w-[600px] h-[600px] bg-[#D63E6D] opacity-30 blur-[160px] top-[-200px] left-[-150px]" />
        <div className="absolute w-[600px] h-[600px] bg-[#2A7FFF] opacity-30 blur-[160px] bottom-[-200px] right-[-150px]" />
      </div>

      <div className="flex flex-col justify-center items-center w-full p-10 relative z-10">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9 }}
          className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-2xl"
        >
          <h2 className="text-3xl font-semibold mb-2">Reset Password</h2>
          <p className="text-gray-400 mb-8">
            Enter your new password
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}
            {message && (
              <div className="text-green-400 text-sm text-center bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                {message}
              </div>
            )}
            
            <div>
              <label className="text-sm text-gray-300 mb-2 block">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#2A7FFF] outline-none transition placeholder-gray-400"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || !token}
                minLength={6}
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#2A7FFF] outline-none transition placeholder-gray-400"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading || !token}
                minLength={6}
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading || !token}
              whileHover={{ scale: loading ? 1 : 1.03 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#3D7A41] to-[#7440A3] font-medium text-white shadow-lg shadow-[#3D7A41]/40 transition disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Remember your password?{" "}
            <Link to="/signin" className="text-[#D63E6D] hover:text-[#2A7FFF] transition">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}