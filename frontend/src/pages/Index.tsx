import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import DarkVeil from "@/components/DarkVeil";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/auth";

const Index = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!auth.isAuthenticated()) {
      navigate("/signup");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/plan-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.getToken()}`
        },
        body: JSON.stringify({ message })
      });
      
      if (response.ok) {
        const result = await response.json();
        // Store result in localStorage for itinerary page
        localStorage.setItem('tripPlan', JSON.stringify(result));
        navigate("/itinerary");
      } else {
        console.error('Failed to plan trip');
      }
    } catch (error) {
      console.error('Error planning trip:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      {/* DarkVeil WebGL Background */}
      <div className="absolute inset-0 overflow-hidden">
        <DarkVeil 
          hueShift={260}
          noiseIntensity={0.02}
          speed={0.3}
          warpAmount={0.5}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl px-4 mx-auto"
        >
          {/* Logo/Brand */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">

              
            </div>
            <p className="text-muted-foreground text-lg">
              Your AI Travel Concierge
            </p>
          </div>

           {/* Chat Input Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-[0_0_40px_-10px_rgba(123,77,255,0.3)] w-full max-w-2xl mx-auto"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Textarea
            placeholder="Tell me about your dream trip... Where do you want to go?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[150px] resize-none bg-black/40 border border-white/10 text-lg rounded-2xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-[#7B4DFF]/50 transition-all"
            disabled={isLoading}
          />

          <Button
            type="submit"
            size="lg"
            disabled={!message.trim() || isLoading}
            className="w-full h-14 rounded-2xl text-lg font-medium text-white bg-gradient-to-r from-[#7B4DFF] to-[#FF4BB4] hover:opacity-90 shadow-lg shadow-[#7B4DFF]/30 transition-all"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce [animation-delay:-0.2s]" />
                  <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce [animation-delay:-0.1s]" />
                  <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce" />
                </div>
                <span>Planning your journey...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Plan My Trip
                <Send className="h-5 w-5" />
              </div>
            )}
          </Button>
        </form>

        {/* Quick Suggestion Buttons */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {[
            "Plan a 7-day trip to Paris",
            "Find flights to Tokyo under ₹50,000",
            "Search trains from Delhi to Goa",
            "2-week beach vacation in Bali",
          ].map((preset, i) => (
            <button
              key={i}
              onClick={() => setMessage(preset)}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm text-gray-400 hover:text-white border border-white/10 transition-all"
            >
              {preset.split(" ")[2] === "trains" ? "🚄 " : "🌍 "}
              {preset}
            </button>
          ))}
        </div>
      </motion.div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Powered by VoyageMind AI
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
