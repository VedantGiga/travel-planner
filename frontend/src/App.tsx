import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Itinerary from "./pages/Itinerary";
import PlanningAnimation from "./pages/PlanningAnimation";
import TravelJournal from "./pages/TravelJournal";
import LiveSharing from "./pages/LiveSharing";
import Reviews from "./pages/Reviews";
import TravelCommunity from "./pages/TravelCommunity";
import SafetyHub from "./pages/SafetyHub";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import MyTrips from "./pages/MyTrips";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/planning" element={<PlanningAnimation />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/journal" element={<TravelJournal />} />
          <Route path="/live-sharing" element={<LiveSharing />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/community" element={<TravelCommunity />} />
          <Route path="/safety" element={<SafetyHub />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/trips" element={<MyTrips />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
