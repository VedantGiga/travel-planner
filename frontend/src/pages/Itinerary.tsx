import { motion } from "framer-motion";
import { MapPin, Hotel, Train, Plane, Calendar, DollarSign, ArrowLeft, Star, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HotelCard from "@/components/chat/HotelCard";
import TrainCard from "@/components/chat/TrainCard";
import FlightCard from "@/components/chat/FlightCard";
import { useState, useEffect } from "react";

const Itinerary = () => {
  const [tripData, setTripData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('tripPlan');
    if (storedData) {
      const data = JSON.parse(storedData);
      console.log('Trip data:', data);
      console.log('Hotels:', data?.planning?.options?.hotels);
      setTripData(data);
    }
  }, []);

  if (!tripData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-zinc-800 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2 text-white">Loading your trip</h2>
          <p className="text-zinc-500 text-sm">Preparing your itinerary</p>
        </div>
      </div>
    );
  }

  const { planning } = tripData;
  const { intent, options, itinerary, totalBudget } = planning;
  
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-zinc-900 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-zinc-900">
              <Link to="/">
                <ArrowLeft className="h-5 w-5 text-zinc-400" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-white tracking-tight">{intent.destination}</h1>
              <p className="text-sm text-zinc-500 mt-0.5">{intent.duration} days · ₹{intent.budget}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 relative overflow-hidden"
        >
          <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl p-8 border border-zinc-800">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502602898536-47ad22581b52')] bg-cover bg-center opacity-10 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-white">{intent.destination}</h1>
                <span className="text-2xl">🇮🇳</span>
              </div>
              
              <p className="text-lg text-zinc-300 mb-6">
                {intent.duration} unforgettable days in {intent.destination} — explore culture, food, and amazing sights.
              </p>
              
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-zinc-700">
                  <Calendar className="h-5 w-5 text-zinc-400 mb-2" />
                  <p className="text-xs text-zinc-400 uppercase tracking-wider">Duration</p>
                  <p className="text-white font-semibold">{intent.duration} days</p>
                </div>
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-zinc-700">
                  <DollarSign className="h-5 w-5 text-zinc-400 mb-2" />
                  <p className="text-xs text-zinc-400 uppercase tracking-wider">Budget</p>
                  <p className="text-white font-semibold">₹{intent.budget}</p>
                </div>
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-zinc-700">
                  <MapPin className="h-5 w-5 text-zinc-400 mb-2" />
                  <p className="text-xs text-zinc-400 uppercase tracking-wider">Trip Type</p>
                  <p className="text-white font-semibold capitalize">{intent.tripType}</p>
                </div>
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-zinc-700">
                  <span className="text-lg mb-2 block">☀️</span>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider">Weather</p>
                  <p className="text-white font-semibold">25°C avg</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors">
                  🪄 Regenerate Plan
                </button>
                <button className="px-4 py-2 bg-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-700 transition-colors border border-zinc-700">
                  Edit Preferences
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* AI Generated Itinerary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-16"
        >
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-6">Itinerary</h2>
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8">
            <div className="whitespace-pre-wrap leading-relaxed">
              {itinerary.split('\n').map((line, index) => {
                if (line.startsWith('Day ') || line.includes('Day ')) {
                  return (
                    <div key={index} className="flex items-center gap-3 mt-8 mb-4 first:mt-0">
                      <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center text-sm font-semibold">
                        {line.match(/\d+/)?.[0] || '1'}
                      </div>
                      <h3 className="text-lg font-semibold text-white">{line}</h3>
                    </div>
                  );
                }
                if (line.includes('₹') || line.includes('Budget') || line.includes('Total')) {
                  return (
                    <div key={index} className="bg-zinc-900 border-l-2 border-white p-4 my-3 rounded-r-lg">
                      <p className="font-medium text-white text-sm">{line}</p>
                    </div>
                  );
                }
                if (line.trim() === '') {
                  return <div key={index} className="h-2"></div>;
                }
                return (
                  <p key={index} className="mb-2 text-zinc-400 leading-relaxed text-sm">
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Flights Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <Plane className="h-5 w-5 text-zinc-500" />
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Flights</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {options.flights && options.flights.length > 0 ? (
              options.flights.map((flight, index) => (
                <div key={index} className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden hover:border-zinc-800 transition-colors group">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Plane className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{flight.airline}</h3>
                          <p className="text-xs text-zinc-500">Economy Class</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-white">₹{flight.price}</p>
                        <p className="text-xs text-zinc-500">per person</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-center">
                          <p className="text-lg font-semibold text-white">{flight.departure}</p>
                          <p className="text-xs text-zinc-500">{intent.from}</p>
                        </div>
                        <div className="flex-1 mx-4 relative">
                          <div className="h-px bg-zinc-700 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-zinc-950 px-2">
                                <Plane className="h-4 w-4 text-zinc-500" />
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-zinc-500 text-center mt-1">{flight.duration}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-white">{flight.arrival}</p>
                          <p className="text-xs text-zinc-500">{intent.destination}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                        <div className="flex items-center gap-4 text-xs text-zinc-400">
                          <span>✈️ Direct</span>
                          <span>🎒 1 Bag</span>
                          <span>🍽️ Meal</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-8 text-center bg-zinc-950 border border-zinc-900 rounded-2xl">
                <Plane className="h-8 w-8 mx-auto mb-2 text-zinc-700" />
                <p className="text-sm text-zinc-500">No flights available</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Hotels Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <Hotel className="h-5 w-5 text-zinc-500" />
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Accommodation</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {options.hotels && options.hotels.length > 0 ? (
              options.hotels.map((hotel, index) => (
                <HotelCard
                  key={index}
                  name={hotel.name}
                  location={hotel.location}
                  rating={hotel.rating}
                  price={`₹${hotel.price}`}
                  image={hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop"}
                  description={hotel.description}
                  reviewCount={hotel.reviewCount}
                  amenities={hotel.amenities}
                  photos={hotel.photos}
                />
              ))
            ) : (
              <div className="col-span-full p-8 text-center bg-zinc-950 border border-zinc-900 rounded-2xl">
                <Hotel className="h-8 w-8 mx-auto mb-2 text-zinc-700" />
                <p className="text-sm text-zinc-500">No hotels available</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Trains Section */}
        {options.trains && options.trains.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-6">
              <Train className="h-5 w-5 text-zinc-500" />
              <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Trains</h2>
            </div>
            <div className="space-y-4">
              {options.trains.map((train, index) => (
                <div key={index} className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl hover:border-zinc-800 transition-colors">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-semibold text-lg text-white mb-0.5">{train.trainName}</h3>
                      <p className="text-sm text-zinc-500">#{train.trainNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">₹{train.price.ac3}</p>
                      <p className="text-xs text-zinc-500">AC 3-Tier</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-zinc-500 text-xs mb-1">Departure</p>
                      <p className="font-medium text-white">{train.departure}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs mb-1">Arrival</p>
                      <p className="font-medium text-white">{train.arrival}</p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs mb-1">Duration</p>
                      <p className="font-medium text-white">{train.duration}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Tourist Places Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="h-5 w-5 text-zinc-500" />
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Places to Visit</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {options.activities && options.activities.length > 0 ? (
              options.activities.map((activity, index) => (
                <div
                  key={index}
                  className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden hover:border-zinc-800 transition-colors group"
                >
                  <div className="aspect-video relative overflow-hidden bg-zinc-900">
                    <img 
                      src={activity.image} 
                      alt={activity.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 fill-white text-white" />
                      {activity.rating}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-base text-white mb-2">{activity.name}</h3>
                    <p className="text-xs text-zinc-500 mb-4 leading-relaxed">{activity.description}</p>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                        <Clock className="h-3.5 w-3.5" />
                        {activity.duration}
                      </div>
                    </div>
                    <div>
                      <span className="inline-block bg-zinc-900 text-zinc-400 px-2.5 py-1 rounded-lg text-xs font-medium">
                        {activity.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-8 text-center bg-zinc-950 border border-zinc-900 rounded-2xl">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-zinc-700" />
                <p className="text-sm text-zinc-500">No activities available</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Budget Summary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="h-5 w-5 text-zinc-500" />
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Budget Breakdown</h2>
          </div>
          <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl">
            <div className="space-y-3">
              {totalBudget.flights > 0 && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-zinc-400">Flights</span>
                  <span className="font-medium text-white">₹{totalBudget.flights}</span>
                </div>
              )}
              {totalBudget.trains > 0 && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-zinc-400">Trains</span>
                  <span className="font-medium text-white">₹{totalBudget.trains}</span>
                </div>
              )}
              {totalBudget.accommodation > 0 && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-zinc-400">Accommodation ({intent.duration} nights)</span>
                  <span className="font-medium text-white">₹{totalBudget.accommodation}</span>
                </div>
              )}
              {totalBudget.activities > 0 && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-zinc-400">Activities</span>
                  <span className="font-medium text-white">₹{totalBudget.activities}</span>
                </div>
              )}
              <div className="border-t border-zinc-800 pt-3 mt-3 flex justify-between items-center">
                <span className="font-semibold text-white">Total</span>
                <span className="font-semibold text-xl text-white">₹{totalBudget.total}</span>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Itinerary;