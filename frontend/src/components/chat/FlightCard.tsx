import { Plane, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface FlightCardProps {
  airline: string;
  departure: string;
  arrival: string;
  duration: string;
  price: string;
  stops?: number;
}

const FlightCard = ({ airline, departure, arrival, duration, price, stops = 0 }: FlightCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-xl p-4 bg-muted/50 border border-border/50 backdrop-blur-sm hover:border-primary/50 transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold">{airline}</span>
        <span className="text-xs text-muted-foreground">
          {stops === 0 ? "Direct" : `${stops} stop${stops > 1 ? "s" : ""}`}
        </span>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="text-center">
          <div className="text-lg font-bold">{departure}</div>
          <div className="text-xs text-muted-foreground">Departure</div>
        </div>
        
        <div className="flex-1 flex flex-col items-center px-4">
          <Plane className="h-4 w-4 text-primary mb-1" />
          <div className="h-px w-full bg-border" />
          <div className="flex items-center gap-1 mt-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{duration}</span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold">{arrival}</div>
          <div className="text-xs text-muted-foreground">Arrival</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <span className="text-xs text-muted-foreground">Total Price</span>
        <span className="text-lg font-bold text-primary">{price}</span>
      </div>
    </motion.div>
  );
};

export default FlightCard;
