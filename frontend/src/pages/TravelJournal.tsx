import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, MapPin, Calendar, Star, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const TravelJournal = () => {
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    // Mock journal data
    setJournals([
      {
        id: 1,
        destination: "Goa",
        date: "2024-01-15",
        photos: ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80"],
        summary: "Amazing beach vibes and sunset views. The local seafood was incredible!",
        rating: 5,
        highlights: ["Beach sunset", "Seafood dinner", "Water sports"]
      }
    ]);
  }, []);

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
            <h1 className="text-4xl font-bold text-white mb-2">Travel Journal</h1>
            <p className="text-zinc-400">AI-generated memories from your adventures</p>
          </motion.div>

          <div className="space-y-6">
            {journals.map((journal) => (
              <Card key={journal.id} className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-[#fcaa13]" />
                        {journal.destination}
                      </CardTitle>
                      <p className="text-zinc-400 flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(journal.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-zinc-600">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-zinc-600">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <img
                        src={journal.photos[0]}
                        alt={journal.destination}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < journal.rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-zinc-300 mb-4">{journal.summary}</p>
                      <div className="space-y-2">
                        <h4 className="text-white font-medium">Highlights:</h4>
                        {journal.highlights.map((highlight, i) => (
                          <div key={i} className="text-sm text-zinc-400">• {highlight}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelJournal;