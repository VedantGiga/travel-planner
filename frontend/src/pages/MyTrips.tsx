import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, DollarSign, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/auth";

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/trips', {
        headers: {
          'Authorization': `Bearer ${auth.getToken()}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      }
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.getToken()}`
        }
      });
      
      if (response.ok) {
        setTrips(trips.filter(trip => trip.id !== tripId));
      }
    } catch (error) {
      console.error('Failed to delete trip:', error);
    }
  };

  const deleteAllTrips = async () => {
    if (confirm('Are you sure you want to delete all trips? This cannot be undone.')) {
      try {
        const response = await fetch('http://localhost:5000/api/trips/all', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${auth.getToken()}`
          }
        });
        
        if (response.ok) {
          setTrips([]);
        }
      } catch (error) {
        console.error('Failed to delete all trips:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-zinc-800 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2 text-white">Loading your trips</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">My Trips</h1>
                <p className="text-zinc-400">Manage your planned adventures</p>
              </div>
              {trips.length > 0 && (
                <Button
                  onClick={deleteAllTrips}
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All
                </Button>
              )}
            </div>
          </motion.div>

          {trips.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <MapPin className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
              <h2 className="text-2xl font-semibold text-white mb-2">No trips yet</h2>
              <p className="text-zinc-400 mb-6">Start planning your first adventure!</p>
              <Link to="/">
                <Button className="bg-[#7B4DFF] hover:bg-[#6B3FEF]">
                  Plan New Trip
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip, index) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{trip.destination}</h3>
                        <p className="text-zinc-400 text-sm">{trip.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-zinc-600 text-white hover:bg-zinc-800"
                          onClick={() => {
                            localStorage.setItem('tripPlan', JSON.stringify({
                              trip,
                              planning: { intent: { destination: trip.destination, duration: Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)), budget: trip.budget }, options: { hotels: [], activities: [], flights: [], trains: [] } }
                            }));
                            window.location.href = '/itinerary';
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          onClick={() => deleteTrip(trip.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-zinc-300">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm">₹{trip.budget}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-zinc-300">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))} days</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTrips;