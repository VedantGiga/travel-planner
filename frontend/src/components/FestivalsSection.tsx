import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Music, Users, Palette, Sparkles } from "lucide-react";

const festivals = [
  {
    title: "Ziro Festival",
    category: "Music & Nature",
    description: "Indie music in the misty hills of Arunachal Pradesh",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
    icon: Music,
    place: "Ziro"
  },
  {
    title: "Magnetic Fields",
    category: "Music & Nature", 
    description: "Desert EDM vibes in Rajasthan's golden dunes",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&q=80",
    icon: Music,
    place: "Alsisar"
  },
  {
    title: "NH7 Weekender",
    category: "Music & Nature",
    description: "India's happiest music festival",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80",
    icon: Sparkles,
    place: "Pune"
  },
  {
    title: "Hornbill Festival",
    category: "Tribal & Culture",
    description: "Tribal rock and warrior traditions in Nagaland",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
    icon: Users,
    place: "Kohima"
  },
  {
    title: "Comic Con India",
    category: "Pop Culture & Cosplay",
    description: "Anime, K-pop, and fandom celebration",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
    icon: Sparkles,
    place: "Mumbai"
  },
  {
    title: "Kala Ghoda",
    category: "Art & Lifestyle",
    description: "Urban art festival in Mumbai's cultural heart",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
    icon: Palette,
    place: "Mumbai"
  },
];

const whyYouthLove = [
  "Freedom",
  "Music", 
  "Art",
  "Travel",
  "Expression",
];

interface FestivalsSectionProps {
  onFestivalClick: (message: string) => void;
}

const FestivalsSection = ({ onFestivalClick }: FestivalsSectionProps) => {
  return (
    <section className="py-16 relative z-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            🎭 Hidden Youth Festivals of India
          </h2>
          <p className="text-zinc-400 text-lg max-w-3xl mx-auto">
            Discover unique experiences beyond the mainstream. From tribal celebrations
            to desert raves, explore India's vibrant youth culture.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {festivals.map((festival, index) => {
            const Icon = festival.icon;
            return (
              <motion.div
                key={festival.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="cursor-pointer"
                onClick={() => onFestivalClick(`Plan a trip to ${festival.place} to experience ${festival.title}`)}
              >
                <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 bg-zinc-900 border-zinc-800 hover:scale-105">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={festival.image}
                      alt={festival.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={20} className="text-[#fcaa13]" />
                        <span className="text-xs text-white/80 font-medium">
                          {festival.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {festival.title}
                      </h3>
                      <p className="text-sm text-white/80">
                        {festival.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-8"
        >
          <h3 className="text-2xl font-bold mb-6 text-center text-white">
            Why Youth Love Them
          </h3>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {whyYouthLove.map((item) => (
              <div
                key={item}
                className="px-6 py-3 bg-zinc-800 rounded-full text-white font-medium hover:bg-[#fcaa13]/20 transition-colors"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="text-center text-zinc-400">
            <span className="font-semibold text-white">Future Scope:</span> Youth
            tourism • Local art preservation • Global creative image
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FestivalsSection;