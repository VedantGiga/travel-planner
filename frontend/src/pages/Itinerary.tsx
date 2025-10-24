import { motion } from "framer-motion";
import { MapPin, Hotel, Train, Plane, Calendar, DollarSign, ArrowLeft } from "lucide-react";
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
      setTripData(JSON.parse(storedData));
    }
  }, []);

  if (!tripData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading your trip...</h2>
          <p className="text-muted-foreground">Please wait while we prepare your itinerary.</p>
        </div>
      </div>
    );
  }

  const { planning } = tripData;
  const { intent, options, itinerary, totalBudget } = planning;
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="rounded-full">
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Your {intent.destination} Adventure</h1>
              <p className="text-sm text-muted-foreground">{intent.duration} days • ₹{intent.budget} budget</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Overview Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-3xl text-white">
            <h2 className="text-3xl font-bold mb-4">Trip Overview</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 mt-1" />
                <div>
                  <p className="font-semibold">Duration</p>
                  <p className="text-white/90">{intent.duration} days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-1" />
                <div>
                  <p className="font-semibold">Destination</p>
                  <p className="text-white/90">{intent.destination}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 mt-1" />
                <div>
                  <p className="font-semibold">Budget</p>
                  <p className="text-white/90">₹{intent.budget} total</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* AI Generated Itinerary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4">AI Generated Itinerary</h2>
          <div className="bg-gradient-to-br from-card/80 to-card/40 border border-border/50 rounded-2xl backdrop-blur-sm overflow-hidden">
            <div className="p-6">
              <div className="prose prose-sm max-w-none text-foreground">
                <div className="whitespace-pre-wrap leading-relaxed font-medium">
                  {itinerary.split('\n').map((line, index) => {
                    if (line.startsWith('Day ') || line.includes('Day ')) {
                      return (
                        <div key={index} className="flex items-center gap-2 mt-6 mb-3 first:mt-0">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {line.match(/\d+/)?.[0] || '1'}
                          </div>
                          <h3 className="text-lg font-bold text-primary">{line}</h3>
                        </div>
                      );
                    }
                    if (line.includes('₹') || line.includes('Budget') || line.includes('Total')) {
                      return (
                        <div key={index} className="bg-primary/10 border-l-4 border-primary p-3 my-2 rounded-r-lg">
                          <p className="font-semibold text-primary">{line}</p>
                        </div>
                      );
                    }
                    if (line.trim() === '') {
                      return <div key={index} className="h-2"></div>;
                    }
                    return (
                      <p key={index} className="mb-2 text-muted-foreground leading-relaxed">
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Flights Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Plane className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Flights</h2>
          </div>
          <div className="space-y-4">
            {options.flights && options.flights.length > 0 ? (
              options.flights.map((flight, index) => (
                <FlightCard
                  key={index}
                  airline={flight.airline}
                  departure={flight.departure}
                  arrival={flight.arrival}
                  duration={flight.duration}
                  price={`₹${flight.price}`}
                  stops={0}
                />
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No flights available for this route
              </div>
            )}
          </div>
        </motion.section>

        {/* Hotels Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <Hotel className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Accommodation</h2>
          </div>
          <div className="space-y-4">
            {options.hotels && options.hotels.length > 0 ? (
              options.hotels.map((hotel, index) => (
                <HotelCard
                  key={index}
                  name={hotel.name}
                  location={hotel.location}
                  rating={hotel.rating}
                  price={`₹${hotel.price}`}
                  image={hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop"}
                />
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No hotels available for this destination
              </div>
            )}
          </div>
        </motion.section>

        {/* Trains Section */}
        {options.trains && options.trains.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <Train className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Trains</h2>
            </div>
            <div className="space-y-4">
              {options.trains.map((train, index) => (
                <div key={index} className="p-6 bg-card/50 border border-border/50 rounded-2xl backdrop-blur-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{train.trainName}</h3>
                      <p className="text-sm text-muted-foreground">Train #{train.trainNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">₹{train.price.ac3}</p>
                      <p className="text-sm text-muted-foreground">AC 3-Tier</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Departure</p>
                      <p className="font-semibold">{train.departure}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Arrival</p>
                      <p className="font-semibold">{train.arrival}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-semibold">{train.duration}</p>
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
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Places to Visit</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {options.activities && options.activities.length > 0 ? (
              options.activities.map((activity, index) => (
                <div
                  key={index}
                  className="p-6 bg-card/50 border border-border/50 rounded-2xl backdrop-blur-sm hover:border-primary/50 transition-colors"
                >
                  <h3 className="font-bold text-lg mb-2">{activity.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{activity.description || activity.category}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Calendar className="h-4 w-4" />
                      {activity.duration}
                    </div>
                    <div className="text-sm font-semibold">
                      ${activity.price}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-4 text-center text-muted-foreground">
                No activities available for this destination
              </div>
            )}
          </div>
        </motion.section>



        {/* Budget Summary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Budget Breakdown</h2>
          </div>
          <div className="p-6 bg-card/50 border border-border/50 rounded-2xl backdrop-blur-sm">
            <div className="space-y-3">
              {totalBudget.flights > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Flights</span>
                  <span className="font-semibold">${totalBudget.flights}</span>
                </div>
              )}
              {totalBudget.trains > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Trains</span>
                  <span className="font-semibold">${totalBudget.trains}</span>
                </div>
              )}
              {totalBudget.accommodation > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Accommodation ({intent.duration} nights)</span>
                  <span className="font-semibold">${totalBudget.accommodation}</span>
                </div>
              )}
              {totalBudget.activities > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Activities</span>
                  <span className="font-semibold">${totalBudget.activities}</span>
                </div>
              )}
              <div className="border-t border-border/50 pt-3 mt-3 flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-primary">${totalBudget.total}</span>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Itinerary;
