import { motion } from "framer-motion";
import { MapPin, Hotel, Train, Plane, Calendar, DollarSign, ArrowLeft, Star, Clock, TrendingDown, AlertCircle, CheckCircle } from "lucide-react";
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

  const [destinationImage, setDestinationImage] = useState('');

  useEffect(() => {
    const fetchDestinationImage = async () => {
      if (tripData?.planning?.intent?.destination) {
        try {
          const wikiResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(tripData.planning.intent.destination)}`);
          const wikiData = await wikiResponse.json();
          
          if (wikiData.thumbnail?.source) {
            setDestinationImage(wikiData.thumbnail.source.replace(/\/\d+px-/, '/1920px-'));
          }
        } catch (error) {
          console.error('Failed to fetch destination image');
        }
      }
    };
    
    fetchDestinationImage();
  }, [tripData]);

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
  const { intent, options, itinerary, totalBudget, budgetAnalysis, localTips } = planning;
  
  return (
    <div className="min-h-screen bg-black">
      {/* Full Page Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {destinationImage && (
          <img 
            src={destinationImage} 
            alt={intent.destination}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Back Button */}
        <Button asChild variant="ghost" size="icon" className="absolute top-6 left-6 z-20 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40">
          <Link to="/">
            <ArrowLeft className="h-5 w-5 text-white" />
          </Link>
        </Button>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-6">
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-4"
          >
            {intent.destination}
          </motion.h1>
          
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-8 text-xl mb-8"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{intent.duration} Days</span>
            </div>
            <div className="flex items-center gap-2">
              <span>👥</span>
              <span>{intent.travelers} Travelers</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              <span>₹{intent.budget}</span>
            </div>
          </motion.div>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Discover the magic of {intent.destination} with our AI-curated itinerary
          </motion.p>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </motion.section>

      <div className="container mx-auto px-6 py-16 max-w-6xl">
        
        {/* Hotels Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <Hotel className="h-6 w-6 text-white" />
            <h2 className="text-3xl font-bold text-white">Hotel Recommendations</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {options.hotels && options.hotels.length > 0 ? (
              options.hotels.map((hotel, index) => (
                <div key={index} className="bg-zinc-900 rounded-2xl overflow-hidden hover:bg-zinc-800 transition-colors">
                  <div className="aspect-video bg-zinc-800">
                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{hotel.name}</h3>
                    <p className="text-zinc-400 text-sm mb-4">{hotel.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white font-medium">{hotel.rating}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">₹{hotel.price}</p>
                        <p className="text-xs text-zinc-400">per night</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Hotel className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
                <p className="text-zinc-400">No hotels available</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Tourist Places */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <MapPin className="h-6 w-6 text-white" />
            <h2 className="text-3xl font-bold text-white">Places to Visit</h2>
          </div>
          
          {/* Day Menu */}
          <div className="flex gap-2 mb-8 overflow-x-auto">
            {Array.from({ length: intent.duration }, (_, dayIndex) => {
              const dayNumber = dayIndex + 1;
              return (
                <button
                  key={dayNumber}
                  className={`px-6 py-3 rounded-full font-medium whitespace-nowrap ${
                    dayNumber === 1 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  Day {dayNumber}
                </button>
              );
            })}
          </div>
          
          {/* Places Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {options.activities && options.activities.length > 0 ? (
              options.activities.map((place, index) => (
                <div key={index} className="bg-zinc-900 rounded-2xl overflow-hidden hover:bg-zinc-800 transition-colors">
                  <div className="aspect-video bg-zinc-800">
                    <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {place.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white font-medium">{place.rating}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{place.name}</h3>
                    <p className="text-zinc-400 text-sm mb-4">{place.description}</p>
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{place.duration}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
                <p className="text-zinc-400">No places found for {intent.destination}</p>
              </div>
            )}
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



        {/* Budget Analysis */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="h-5 w-5 text-zinc-500" />
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">💼 Budget Analysis</h2>
          </div>
          
          {budgetAnalysis ? (
            <div className="space-y-6">
              {/* Budget Status */}
              <div className={`p-6 rounded-2xl border ${
                budgetAnalysis.budgetBreakdown.isWithinBudget 
                  ? 'bg-green-950/30 border-green-800/50' 
                  : 'bg-red-950/30 border-red-800/50'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  {budgetAnalysis.budgetBreakdown.isWithinBudget ? (
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-red-400" />
                  )}
                  <h3 className="text-lg font-semibold text-white">
                    {budgetAnalysis.budgetBreakdown.isWithinBudget 
                      ? 'Budget Optimized ✅' 
                      : 'Budget Exceeded - Optimizations Applied'}
                  </h3>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Target Budget</p>
                    <p className="text-xl font-bold text-white">₹{budgetAnalysis.budgetBreakdown.totalBudget}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Estimated Cost</p>
                    <p className="text-xl font-bold text-white">₹{budgetAnalysis.budgetBreakdown.estimatedCost}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">
                      {budgetAnalysis.budgetBreakdown.savings >= 0 ? 'Savings' : 'Overspend'}
                    </p>
                    <p className={`text-xl font-bold ${
                      budgetAnalysis.budgetBreakdown.savings >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ₹{Math.abs(budgetAnalysis.budgetBreakdown.savings)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Budget Breakdown */}
              <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl">
                <h3 className="text-lg font-semibold text-white mb-4">Detailed Breakdown</h3>
                <div className="space-y-4">
                  {Object.entries(budgetAnalysis.budgetBreakdown.breakdown).map(([category, data]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-zinc-400 capitalize">{category.replace(/([A-Z])/g, ' $1')}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500">{data.percentage}%</span>
                          <span className="font-medium text-white">₹{data.amount}</span>
                        </div>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(data.percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  <div className="border-t border-zinc-800 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white">Daily Budget</span>
                      <span className="font-semibold text-xl text-white">₹{budgetAnalysis.budgetBreakdown.dailyBudget}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optimizations */}
              {budgetAnalysis.optimizations && budgetAnalysis.optimizations.length > 0 && (
                <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingDown className="h-5 w-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Cost Optimizations Applied</h3>
                  </div>
                  <div className="space-y-3">
                    {budgetAnalysis.optimizations.map((opt, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                        <div>
                          <p className="font-medium text-white">{opt.category}</p>
                          <p className="text-sm text-zinc-400">{opt.suggestion}</p>
                        </div>
                        <div className="text-green-400 font-semibold">-₹{opt.savings}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {budgetAnalysis.recommendations && budgetAnalysis.recommendations.length > 0 && (
                <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl">
                  <h3 className="text-lg font-semibold text-white mb-4">💡 Smart Recommendations</h3>
                  <div className="space-y-2">
                    {budgetAnalysis.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-zinc-900 rounded-lg">
                        <span className="text-blue-400 mt-0.5">💡</span>
                        <p className="text-sm text-zinc-300">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Fallback to original budget display
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
          )}
        </motion.section>

        {/* Local Tips */}
        {localTips && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-lg">🗺️</span>
              <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Local Insider Tips</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {localTips.cultural && (
                <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl">
                  <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                    🏛️ Cultural Tips
                  </h3>
                  <p className="text-sm text-zinc-400">{localTips.cultural}</p>
                </div>
              )}
              {localTips.food && (
                <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl">
                  <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                    🍜 Food & Dining
                  </h3>
                  <p className="text-sm text-zinc-400">{localTips.food}</p>
                </div>
              )}
              {localTips.transportation && (
                <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl">
                  <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                    🚌 Transportation
                  </h3>
                  <p className="text-sm text-zinc-400">{localTips.transportation}</p>
                </div>
              )}
              {localTips.shopping && (
                <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl">
                  <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                    🛍️ Shopping
                  </h3>
                  <p className="text-sm text-zinc-400">{localTips.shopping}</p>
                </div>
              )}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default Itinerary;