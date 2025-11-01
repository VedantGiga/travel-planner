import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Share2, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/Navbar";

const LiveSharing = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Mumbai, India");
  const [followers, setFollowers] = useState([
    { name: "Mom", status: "online", lastSeen: "now" },
    { name: "Dad", status: "offline", lastSeen: "2h ago" },
    { name: "Sarah", status: "online", lastSeen: "5m ago" }
  ]);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Live Trip Sharing</h1>
            <p className="text-zinc-400">Share your location with family and friends</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Location Sharing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300">Share live location</span>
                  <Switch checked={isSharing} onCheckedChange={setIsSharing} />
                </div>
                
                {isSharing && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-sm">Sharing location</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-zinc-300">
                      <MapPin className="h-4 w-4 text-[#fcaa13]" />
                      <span className="text-sm">{currentLocation}</span>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-[#fcaa13] to-[#fb6b10]">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Trip Link
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Following Your Trip ({followers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {followers.map((follower, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          follower.status === 'online' ? 'bg-green-400' : 'bg-zinc-600'
                        }`} />
                        <span className="text-zinc-300">{follower.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Clock className="h-3 w-3" />
                        {follower.lastSeen}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-zinc-900 border-zinc-800 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Trip Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#fcaa13] rounded-full mt-2" />
                  <div>
                    <p className="text-white">Arrived at Gateway of India</p>
                    <p className="text-xs text-zinc-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-zinc-600 rounded-full mt-2" />
                  <div>
                    <p className="text-zinc-300">Checked into Hotel Taj</p>
                    <p className="text-xs text-zinc-500">4 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveSharing;