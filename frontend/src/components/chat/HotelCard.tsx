import { Star, MapPin, Users, Wifi, Car, Coffee } from "lucide-react";
import { motion } from "framer-motion";

interface HotelCardProps {
  name: string;
  image: string;
  price: string;
  rating: number;
  location: string;
  description?: string;
  reviewCount?: number;
  amenities?: string[];
  photos?: string[];
}

const HotelCard = ({ name, image, price, rating, location, description, reviewCount, amenities, photos }: HotelCardProps) => {
  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <Wifi className="h-3 w-3" />;
    if (amenityLower.includes('parking') || amenityLower.includes('car')) return <Car className="h-3 w-3" />;
    if (amenityLower.includes('restaurant') || amenityLower.includes('breakfast')) return <Coffee className="h-3 w-3" />;
    return <Users className="h-3 w-3" />;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden hover:border-zinc-800 transition-colors group"
    >
      <div className="aspect-video relative overflow-hidden bg-zinc-900">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1">
          <Star className="h-3 w-3 fill-white text-white" />
          {rating.toFixed(1)}
        </div>
        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white px-2.5 py-1.5 rounded-lg text-sm font-bold">
          {price}/night
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-base text-white mb-2">{name}</h3>
        <div className="flex items-center gap-1 mb-3">
          <MapPin className="h-3.5 w-3.5 text-zinc-400" />
          <span className="text-xs text-zinc-400">{location}</span>
        </div>
        {description && (
          <p className="text-xs text-zinc-500 mb-4 leading-relaxed line-clamp-2">{description}</p>
        )}
        {reviewCount && (
          <div className="flex items-center gap-1 mb-3">
            <Users className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-xs text-zinc-400">{reviewCount} reviews</span>
          </div>
        )}
        {amenities && amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {amenities.slice(0, 3).map((amenity, index) => (
              <div key={index} className="flex items-center gap-1 bg-zinc-900 text-zinc-400 px-2 py-1 rounded-lg text-xs">
                {getAmenityIcon(amenity)}
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HotelCard;
