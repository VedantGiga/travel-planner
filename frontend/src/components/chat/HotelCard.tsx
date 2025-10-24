import { Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface HotelCardProps {
  name: string;
  image: string;
  price: string;
  rating: number;
  location: string;
}

const HotelCard = ({ name, image, price, rating, location }: HotelCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-xl overflow-hidden bg-muted/50 border border-border/50 backdrop-blur-sm hover:border-primary/50 transition-all"
    >
      <div className="flex gap-3 p-3">
        <img
          src={image}
          alt={name}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h4 className="font-semibold text-sm">{name}</h4>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{location}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span className="text-xs font-medium">{rating}</span>
            </div>
            <span className="text-sm font-bold text-primary">{price}/night</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HotelCard;
