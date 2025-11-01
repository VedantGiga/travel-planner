import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "@/lib/auth";
import { getSliderState, setSliderState, startSlider, stopSlider } from "@/lib/sliderState";

const monuments = [
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
  "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
  "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=800&q=80",
  "https://images.unsplash.com/photo-1599661046827-dacde6976549?w=800&q=80",
  "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
];

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(getSliderState());
  const navigate = useNavigate();

  useEffect(() => {
    startSlider((index) => {
      setCurrentSlide(index);
      setSliderState(index);
    }, monuments.length);
    return () => stopSlider();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await auth.signin(email, password);
      auth.setToken(response.token);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 relative overflow-hidden">
        {monuments.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
              index === currentSlide ? 'translate-x-0' : 
              index < currentSlide ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            <img 
              src={image} 
              alt="Monument" 
              className="h-full w-full object-cover" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement.style.background = 'linear-gradient(135deg, #fcaa13, #fb6b10)';
              }}
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        ))}
        <div className="absolute bottom-8 right-8 flex gap-2">
          {monuments.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#fcaa13] to-[#fb6b10] bg-clip-text text-transparent">VoyageAI</h1>
            <p className="text-muted-foreground">Welcome back, explorer</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link></CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="text-destructive text-sm p-3 bg-destructive/10 border border-destructive/20 rounded">{error}</div>}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
                  <div className="text-right"><Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link></div>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-[#fcaa13] to-[#fb6b10] hover:from-[#fb6b10] hover:to-[#ef420f]" disabled={loading}>
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}