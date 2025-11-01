import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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

export default function SignUp() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agree: false,
  });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.agree) {
      setError("Please agree to the terms and conditions");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const name = `${form.firstName} ${form.lastName}`.trim();
      const response = await auth.signup(form.email, form.password, name);
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
            <p className="text-muted-foreground">Start your journey</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Already have an account? <Link to="/signin" className="text-primary hover:underline">Sign in</Link></CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="text-destructive text-sm p-3 bg-destructive/10 border border-destructive/20 rounded">{error}</div>}
                <div className="flex gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input name="firstName" type="text" placeholder="John" value={form.firstName} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input name="lastName" type="text" placeholder="Doe" value={form.lastName} onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox name="agree" checked={form.agree} onCheckedChange={(checked) => setForm({ ...form, agree: checked as boolean })} />
                  <span className="text-sm">I agree to the <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link></span>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-[#fcaa13] to-[#fb6b10] hover:from-[#fb6b10] hover:to-[#ef420f]" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}