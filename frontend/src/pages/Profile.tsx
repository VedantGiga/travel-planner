import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, MapPin, Settings, Edit3, Camera, Phone, Globe, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/auth";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    occupation: "",
    avatar: "",
    joinDate: "",
    totalTrips: 0,
    favoriteDestination: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", bio: "", location: "", occupation: "" });
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    // Mock user data - replace with actual API call
    const userData = {
      name: "Travel Explorer",
      email: "explorer@example.com",
      phone: "+91 98765 43210",
      bio: "Passionate traveler exploring the world one destination at a time. Love adventure, culture, and meeting new people.",
      location: "Mumbai, India",
      occupation: "Digital Nomad",
      avatar: "",
      joinDate: "January 2024",
      totalTrips: 5,
      favoriteDestination: "Goa"
    };
    setUser(userData);
    setEditForm({ name: userData.name, email: userData.email, phone: userData.phone, bio: userData.bio, location: userData.location, occupation: userData.occupation });
    setAvatarPreview(userData.avatar);
  }, []);

  const handleSave = () => {
    setUser({ ...user, ...editForm, avatar: avatarPreview });
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
                <div className="relative">
                  {user.avatar || avatarPreview ? (
                    <img src={avatarPreview || user.avatar} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-zinc-700" />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-r from-[#fcaa13] to-[#fb6b10] rounded-full flex items-center justify-center">
                      <User className="h-16 w-16 text-white" />
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-[#fcaa13] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#fb6b10] transition-colors">
                      <Camera className="h-5 w-5 text-white" />
                      <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </label>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
                  <p className="text-zinc-400 mb-1">{user.occupation}</p>
                  <p className="text-zinc-500 text-sm mb-4">{user.email}</p>
                  <p className="text-zinc-300 mb-4 max-w-2xl">{user.bio}</p>
                  <div className="flex items-center gap-6 text-sm text-zinc-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#fcaa13]" />
                      <span>{user.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#fcaa13]" />
                      <span>Joined {user.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-[#fcaa13]" />
                      <span>{user.totalTrips} trips</span>
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
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Full Name</label>
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
                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Phone</label>
                    <Input
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Location</label>
                    <Input
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Occupation</label>
                    <Input
                      value={editForm.occupation}
                      onChange={(e) => setEditForm({ ...editForm, occupation: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-zinc-400 mb-2 block">Bio</label>
                    <Textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button onClick={handleSave} className="bg-gradient-to-r from-[#fcaa13] to-[#fb6b10] hover:opacity-90">
                    Save Changes
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" className="border-zinc-600 text-white hover:bg-zinc-800">
                    Cancel
                  </Button>
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