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
import Lottie from "lottie-react";
import animationData from "@/assets/airplane-animation.json";

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

    localStorage.removeItem('tripPlan');
    navigate("/planning", { replace: true });
    
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
        const tripId = Date.now().toString();
        const tripData = { ...result, id: tripId, createdAt: new Date().toISOString() };
        localStorage.setItem('tripPlan', JSON.stringify(tripData));
        localStorage.setItem(`trip_${tripId}`, JSON.stringify(tripData));
      } else {
        console.error('Failed to plan trip');
      }
    } catch (error) {
      console.error('Error planning trip:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
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
      <div className="relative z-10">
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 min-h-[calc(100vh-140px)]">
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
                  disabled={!message.trim()}
                  className="w-full h-14 rounded-3xl text-lg font-medium text-white bg-gradient-to-r from-[#7B4DFF] to-[#FF4BB4] hover:opacity-90 transition-all"
                >
                  <div className="flex items-center gap-3">
                    Plan My Trip
                    <Send className="h-5 w-5" />
                  </div>
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
        <div className="lg:hidden px-4">
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
                disabled={!message.trim()}
                className="w-full h-14 rounded-3xl text-lg font-medium text-white bg-gradient-to-r from-[#7B4DFF] to-[#FF4BB4] hover:opacity-90 transition-all"
              >
                <div className="flex items-center gap-2">
                  Plan My Trip
                  <Send className="h-5 w-5" />
                </div>
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
          
          {/* Indian Hidden Festivals Section - Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Hidden Grooves Of india</h2>
              <p className="text-zinc-400">Discover unique festivals off the beaten path</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Hornbill Festival", emoji: "🦅", location: "Nagaland", month: "Dec", color: "from-[#fcaa13] to-[#fb6b10]", place: "Kohima" },
                { name: "Hemis Festival", emoji: "🏔️", location: "Ladakh", month: "Jun-Jul", color: "from-[#fb6b10] to-[#ef420f]", place: "Leh" },
                { name: "Pushkar Fair", emoji: "🐪", location: "Rajasthan", month: "Nov", color: "from-[#ef420f] to-[#b62319]", place: "Pushkar" },
                { name: "Thrissur Pooram", emoji: "🐘", location: "Kerala", month: "Apr-May", color: "from-[#b62319] to-[#742f45]", place: "Thrissur" }
              ].map((festival, index) => (
                <div
                  key={festival.name}
                  className="cursor-pointer"
                  onClick={() => {
                    setMessage(`Plan a trip to ${festival.place} to experience ${festival.name}`);
                  }}
                >
                  <div className={`bg-gradient-to-br ${festival.color} rounded-xl p-4 text-white hover:scale-105 transition-transform duration-300`}>
                    <div className="text-2xl mb-2">{festival.emoji}</div>
                    <h3 className="text-sm font-bold mb-1">{festival.name}</h3>
                    <p className="text-white/80 text-xs mb-1">{festival.place}</p>
                    <p className="text-white/60 text-xs">{festival.month}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Indian Hidden Festivals Section - Desktop */}
      <div className="hidden lg:block relative z-10 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">🎭 Hidden Gems of India</h2>
            <p className="text-zinc-400 text-lg">Discover unique festivals off the beaten path</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Hornbill Festival", emoji: "🦅", location: "Nagaland", month: "Dec", color: "from-[#fcaa13] to-[#fb6b10]", place: "Kohima" },
              { name: "Hemis Festival", emoji: "🏔️", location: "Ladakh", month: "Jun-Jul", color: "from-[#fb6b10] to-[#ef420f]", place: "Leh" },
              { name: "Pushkar Camel Fair", emoji: "🐪", location: "Rajasthan", month: "Nov", color: "from-[#ef420f] to-[#b62319]", place: "Pushkar" },
              { name: "Thrissur Pooram", emoji: "🐘", location: "Kerala", month: "Apr-May", color: "from-[#b62319] to-[#742f45]", place: "Thrissur" },
              { name: "Ziro Music Festival", emoji: "🎵", location: "Arunachal Pradesh", month: "Sep", color: "from-[#742f45] to-[#491531]", place: "Ziro" },
              { name: "Rann Utsav", emoji: "🌙", location: "Gujarat", month: "Nov-Feb", color: "from-[#491531] to-[#000000]", place: "Kutch" }
            ].map((festival, index) => (
              <motion.div
                key={festival.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => {
                  setMessage(`Plan a trip to ${festival.place} to experience ${festival.name}`);
                }}
              >
                <div className={`bg-gradient-to-br ${festival.color} rounded-2xl p-6 text-white hover:scale-105 transition-transform duration-300 shadow-lg`}>
                  <div className="text-4xl mb-3">{festival.emoji}</div>
                  <h3 className="text-lg font-bold mb-2">{festival.name}</h3>
                  <p className="text-white/80 text-sm mb-1">{festival.place}, {festival.location}</p>
                  <p className="text-white/60 text-xs">{festival.month}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Index;