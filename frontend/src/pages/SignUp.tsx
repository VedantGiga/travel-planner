import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { auth } from "@/lib/auth";


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
  const navigate = useNavigate();

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
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#1E1B2E] text-white">
      {/* Left Side */}
      <div className="lg:w-1/2 w-full relative flex flex-col justify-between bg-gradient-to-b from-[#342A56] to-[#1E1B2E] p-10 rounded-br-[3rem]">
        <div className="flex justify-between items-center">
          <img
            src="/download.png"
            alt="VoyageMind"
            className="h-16 w-16"
          />
        </div>

        <div className="text-center mt-20 mb-10 px-6">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
            alt="Scenic"
            className="rounded-3xl shadow-2xl mx-auto w-full max-w-md object-cover"
          />
          <h2 className="mt-6 text-lg font-light tracking-wide text-gray-300">
            Capturing Moments, Creating Memories
          </h2>
          <div className="flex justify-center gap-2 mt-4">
            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="lg:w-1/2 w-full flex items-center justify-center px-6 lg:px-16 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-semibold mb-2">Create an account</h1>
          <p className="text-gray-400 mb-8">
            Already have an account?{" "}
            <Link to="/signin" className="text-[#A78BFA] hover:text-white">
              Log in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                {error}
              </div>
            )}
            <div className="flex gap-4">
              <Input
                name="firstName"
                type="text"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                required
                className="bg-[#2C2543] border-none text-white placeholder:text-gray-500 h-12 rounded-xl"
              />
              <Input
                name="lastName"
                type="text"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                required
                className="bg-[#2C2543] border-none text-white placeholder:text-gray-500 h-12 rounded-xl"
              />
            </div>

            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="bg-[#2C2543] border-none text-white placeholder:text-gray-500 h-12 rounded-xl"
            />

            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              className="bg-[#2C2543] border-none text-white placeholder:text-gray-500 h-12 rounded-xl"
            />

            <div className="flex items-center space-x-2">
              <Checkbox
                name="agree"
                checked={form.agree}
                onCheckedChange={(checked) =>
                  setForm({ ...form, agree: checked as boolean })
                }
              />
              <span className="text-sm text-gray-400">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-[#A78BFA] hover:text-white underline"
                >
                  Terms & Conditions
                </Link>
              </span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A78BFA] hover:bg-[#8B5CF6] text-white rounded-xl h-12 text-base font-medium disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create account"}
            </Button>

            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-700"></div>
              <span className="px-4 text-gray-400 text-sm">
                Or register with
              </span>
              <div className="flex-1 h-px bg-gray-700"></div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 bg-[#2C2543] border border-gray-600 hover:bg-[#3B2D5F] rounded-xl"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
