import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, DollarSign, Send, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { auth } from "@/lib/auth";
import Lottie from "lottie-react";
import animationData from "@/assets/airplane-animation.json";

const TripWizard = () => {
  const [formData, setFormData] = useState({
    from: "",
    destination: "",
    duration: "",
    budget: "",
    travelers: "2",
    tripType: "leisure"
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth.isAuthenticated()) {
      navigate("/signup");
      return;
    }

    localStorage.removeItem('tripPlan');
    navigate("/planning", { replace: true });
    
    try {
      const message = `Plan a ${formData.duration} days ${formData.tripType} trip from ${formData.from} to ${formData.destination} for ${formData.travelers} people with budget ₹${formData.budget}`;
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/plan-trip`, {
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
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 h-full">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Settings className="h-5 w-5 text-[#7B4DFF]" />
          <h2 className="text-xl font-bold text-white">Trip Wizard</h2>
        </div>
        <p className="text-zinc-400 text-sm">Fill in your travel details for a personalized itinerary</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="from" className="text-white flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              From
            </Label>
            <Input
              id="from"
              placeholder="Origin city"
              value={formData.from}
              onChange={(e) => setFormData({...formData, from: e.target.value})}
              className="bg-black/40 border-white/10 text-white placeholder:text-gray-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destination" className="text-white flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Destination
            </Label>
            <Input
              id="destination"
              placeholder="Where to?"
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
              className="bg-black/40 border-white/10 text-white placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-white flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Duration (days)
            </Label>
            <Input
              id="duration"
              type="number"
              placeholder="5"
              min="1"
              max="30"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              className="bg-black/40 border-white/10 text-white placeholder:text-gray-500"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-white flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Budget (₹)
            </Label>
            <Input
              id="budget"
              type="number"
              placeholder="25000"
              min="1000"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              className="bg-black/40 border-white/10 text-white placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="travelers" className="text-white flex items-center gap-2">
              <Users className="h-4 w-4" />
              Travelers
            </Label>
            <Select value={formData.travelers} onValueChange={(value) => setFormData({...formData, travelers: value})}>
              <SelectTrigger className="bg-black/40 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Person</SelectItem>
                <SelectItem value="2">2 People</SelectItem>
                <SelectItem value="3">3 People</SelectItem>
                <SelectItem value="4">4 People</SelectItem>
                <SelectItem value="5">5+ People</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tripType" className="text-white">Trip Type</Label>
            <Select value={formData.tripType} onValueChange={(value) => setFormData({...formData, tripType: value})}>
              <SelectTrigger className="bg-black/40 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leisure">Leisure</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="family">Family</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-14 rounded-2xl text-lg font-medium text-white bg-gradient-to-r from-[#7B4DFF] to-[#FF4BB4] hover:opacity-90 transition-all"
        >
          <div className="flex items-center gap-2">
            Create Trip Plan
            <Send className="h-5 w-5" />
          </div>
        </Button>
      </form>
    </div>
  );
};

export default TripWizard;