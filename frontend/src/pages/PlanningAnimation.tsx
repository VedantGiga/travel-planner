import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from '@/assets/airplane-animation.json';

const PlanningAnimation = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTripData = setInterval(() => {
      const tripData = localStorage.getItem('tripPlan');
      if (tripData) {
        clearInterval(checkTripData);
        setTimeout(() => navigate('/itinerary', { replace: true }), 1000);
      }
    }, 500);

    const timeout = setTimeout(() => {
      clearInterval(checkTripData);
      const tripData = localStorage.getItem('tripPlan');
      if (tripData) {
        navigate('/itinerary', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }, 30000);

    return () => {
      clearInterval(checkTripData);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="w-96 h-64 mb-8">
        <Lottie animationData={animationData} loop={true} />
      </div>
      
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Planning Your Perfect Trip</h2>
        <p className="text-gray-400">AI is crafting your personalized itinerary...</p>
      </div>
    </div>
  );
};

export default PlanningAnimation;