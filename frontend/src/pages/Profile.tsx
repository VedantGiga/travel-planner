import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, MapPin, Settings, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/auth";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    joinDate: "",
    totalTrips: 0,
    favoriteDestination: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  useEffect(() => {
    // Mock user data - replace with actual API call
    const userData = {
      name: "Travel Explorer",
      email: "explorer@example.com", 
      joinDate: "January 2024",
      totalTrips: 5,
      favoriteDestination: "Goa"
    };
    setUser(userData);
    setEditForm({ name: userData.name, email: userData.email });
  }, []);

  const handleSave = () => {
    setUser({ ...user, ...editForm });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          
          {/* Profile Header */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-3xl p-8 border border-zinc-700">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-r from-[#7B4DFF] to-[#FF4BB4] rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                  <p className="text-zinc-400 mb-4">{user.email}</p>
                  <div className="flex items-center gap-6 text-sm text-zinc-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {user.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{user.totalTrips} trips planned</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  className="bg-transparent border-zinc-600 text-white hover:bg-zinc-800"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </motion.section>

          {/* Edit Form */}
          {isEditing && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-12"
            >
              <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                <h3 className="text-xl font-semibold text-white mb-4">Edit Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Name</label>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Email</label>
                    <Input
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleSave} className="bg-[#7B4DFF] hover:bg-[#6B3FEF]">
                      Save Changes
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline" className="border-zinc-600 text-white">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Stats Cards */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="h-6 w-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Total Trips</h3>
                </div>
                <p className="text-3xl font-bold text-white">{user.totalTrips}</p>
                <p className="text-zinc-400 text-sm">Planned adventures</p>
              </div>
              
              <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                <div className="flex items-center gap-3 mb-3">
                  <Settings className="h-6 w-6 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Preferences</h3>
                </div>
                <p className="text-lg font-medium text-white">Budget Travel</p>
                <p className="text-zinc-400 text-sm">Travel style</p>
              </div>
              
              <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="h-6 w-6 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Favorite</h3>
                </div>
                <p className="text-lg font-medium text-white">{user.favoriteDestination}</p>
                <p className="text-zinc-400 text-sm">Top destination</p>
              </div>
            </div>
          </motion.section>

          {/* Recent Trips */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Recent Trips</h2>
            <div className="space-y-4">
              {[
                { destination: "Goa", date: "Dec 2024", duration: "5 days", budget: "₹25,000" },
                { destination: "Jaipur", date: "Nov 2024", duration: "3 days", budget: "₹15,000" },
                { destination: "Mumbai", date: "Oct 2024", duration: "4 days", budget: "₹20,000" }
              ].map((trip, index) => (
                <div key={index} className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{trip.destination}</h3>
                      <p className="text-zinc-400">{trip.date} • {trip.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">{trip.budget}</p>
                      <p className="text-zinc-400 text-sm">Total cost</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

        </div>
      </div>
    </div>
  );
};

export default Profile;