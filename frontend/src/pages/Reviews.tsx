import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp, MessageSquare, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";

const Reviews = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      destination: "Goa",
      rating: 5,
      comment: "AI suggestions were spot on! The beach recommendations were perfect.",
      user: "Priya S.",
      date: "2024-01-15",
      helpful: 12,
      category: "Beach"
    },
    {
      id: 2,
      destination: "Ladakh",
      rating: 4,
      comment: "Great itinerary but could use more local food suggestions.",
      user: "Rahul K.",
      date: "2024-01-10",
      helpful: 8,
      category: "Adventure"
    }
  ]);

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    destination: ""
  });

  const submitReview = () => {
    if (newReview.comment && newReview.destination) {
      const review = {
        id: Date.now(),
        ...newReview,
        user: "You",
        date: new Date().toISOString().split('T')[0],
        helpful: 0,
        category: "General"
      };
      setReviews([review, ...reviews]);
      setNewReview({ rating: 5, comment: "", destination: "" });
    }
  };

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
            <h1 className="text-4xl font-bold text-white mb-2">Trip Reviews</h1>
            <p className="text-zinc-400">Rate and review AI suggestions to help improve recommendations</p>
          </motion.div>

          <Card className="bg-zinc-900 border-zinc-800 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Write a Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-zinc-300 text-sm mb-2 block">Destination</label>
                <input
                  type="text"
                  placeholder="Where did you travel?"
                  value={newReview.destination}
                  onChange={(e) => setNewReview({...newReview, destination: e.target.value})}
                  className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                />
              </div>
              
              <div>
                <label className="text-zinc-300 text-sm mb-2 block">Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 cursor-pointer ${
                        star <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"
                      }`}
                      onClick={() => setNewReview({...newReview, rating: star})}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-zinc-300 text-sm mb-2 block">Review</label>
                <Textarea
                  placeholder="How were the AI suggestions? What worked well?"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <Button 
                onClick={submitReview}
                className="bg-gradient-to-r from-[#fcaa13] to-[#fb6b10]"
              >
                Submit Review
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-white font-semibold">{review.destination}</h3>
                      <p className="text-zinc-400 text-sm">{review.user} • {review.date}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-zinc-300 mb-4">{review.comment}</p>
                  
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                    <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
                      {review.category}
                    </span>
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

export default Reviews;