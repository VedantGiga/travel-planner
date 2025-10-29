import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, MessageSquare, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import DarkVeil from "@/components/DarkVeil";
import Navbar from "@/components/Navbar";
import TripWizard from "@/components/TripWizard";
import { auth } from "@/lib/auth";

const Index = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'chat' | 'wizard'>('chat');
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
    <div className="h-screen bg-white relative overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 overflow-hidden">
        <DarkVeil 
          hueShift={270}
          noiseIntensity={0.02}
          speed={0.3}
          warpAmount={0.5}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-16 pb-4">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-2">
            
          </div>
          
        </div>
      </div>

      {/* Main Content - Two Full Sections */}
      <div className="relative z-10 h-[calc(100vh-140px)]">
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 h-full">
          {/* Chat Mode Section */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center justify-center p-12 border-r border-white/10"
          >
            <div className="w-full max-w-2xl backdrop-blur-xl bg-white/8 border border-white/20 rounded-3xl p-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <MessageSquare className="h-7 w-7 text-[#7B4DFF]" />
                  <h2 className="text-2xl font-bold text-white">Chat Mode</h2>
                </div>
                <p className="text-zinc-400 text-base">Describe your trip in natural language</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <Textarea
                  placeholder="Tell me about your dream trip... Where do you want to go?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[180px] resize-none bg-black/40 border border-white/20 text-lg rounded-3xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-[#7B4DFF]/50 transition-all p-5"
                  disabled={isLoading}
                />

                <Button
                  type="submit"
                  size="lg"
                  disabled={!message.trim() || isLoading}
                  className="w-full h-14 rounded-3xl text-lg font-medium text-white bg-gradient-to-r from-[#7B4DFF] to-[#FF4BB4] hover:opacity-90 transition-all"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center space-x-1">
                        <span className="w-2.5 h-2.5 bg-white/70 rounded-full animate-bounce [animation-delay:-0.2s]" />
                        <span className="w-2.5 h-2.5 bg-white/70 rounded-full animate-bounce [animation-delay:-0.1s]" />
                        <span className="w-2.5 h-2.5 bg-white/70 rounded-full animate-bounce" />
                      </div>
                      <span>Planning your journey...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      Plan My Trip
                      <Send className="h-5 w-5" />
                    </div>
                  )}
                </Button>
              </form>

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
                    className="px-3 py-2 rounded-full bg-white/8 hover:bg-white/15 text-xs text-gray-400 hover:text-white border border-white/20 transition-all"
                  >
                    {preset.split(" ")[2] === "trains" ? "🚄 " : "🌍 "}
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Trip Wizard Section */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center justify-center p-8"
          >
            <div className="w-full max-w-2xl">
              <TripWizard />
            </div>
          </motion.section>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden px-4 h-full overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="backdrop-blur-xl bg-white/8 border border-white/20 rounded-3xl p-8"
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-3">
                <MessageSquare className="h-6 w-6 text-[#7B4DFF]" />
                <h2 className="text-2xl font-bold text-white">Chat Mode</h2>
              </div>
              <p className="text-zinc-400 text-base">Describe your trip in natural language</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Textarea
                placeholder="Tell me about your dream trip..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[160px] resize-none bg-black/40 border border-white/20 text-lg rounded-3xl text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-[#7B4DFF]/50 transition-all p-5"
                disabled={isLoading}
              />

              <Button
                type="submit"
                size="lg"
                disabled={!message.trim() || isLoading}
                className="w-full h-14 rounded-3xl text-lg font-medium text-white bg-gradient-to-r from-[#7B4DFF] to-[#FF4BB4] hover:opacity-90 transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center space-x-1">
                      <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce [animation-delay:-0.2s]" />
                      <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce [animation-delay:-0.1s]" />
                      <span className="w-2 h-2 bg-white/70 rounded-full animate-bounce" />
                    </div>
                    <span>Planning...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Plan My Trip
                    <Send className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </form>
          </motion.div>

          <div className="flex items-center justify-center py-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-white/15"></div>
            <div className="mx-6 px-6 py-3 rounded-full bg-white/10 border border-white/20">
              <span className="text-zinc-300 font-medium text-base">OR</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-white/15 via-white/30 to-transparent"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <TripWizard />
          </motion.div>
        </div>
      </div>


    </div>
  );
};

export default Index;