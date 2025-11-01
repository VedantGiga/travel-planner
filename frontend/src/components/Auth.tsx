import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const places = [
  { name: "Taj Mahal", color: "from-[#fcaa13] to-[#fb6b10]" },
  { name: "Eiffel Tower", color: "from-[#fb6b10] to-[#ef420f]" },
  { name: "Great Wall", color: "from-[#ef420f] to-[#b62319]" },
  { name: "Machu Picchu", color: "from-[#b62319] to-[#742f45]" },
];

const Auth = () => {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated Background Cards */}
      <div className="absolute inset-0 overflow-hidden">
        {/* First Row - Moving Right */}
        <div className="absolute top-0 flex gap-6 animate-[slide-right_40s_linear_infinite] whitespace-nowrap">
          {[...places, ...places, ...places].map((place, index) => (
            <div
              key={`row1-${index}`}
              className="relative h-48 w-80 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg"
            >
              <div className={`h-full w-full bg-gradient-to-br ${place.color}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-4 text-white font-bold text-lg">
                {place.name}
              </p>
            </div>
          ))}
        </div>

        {/* Second Row - Moving Left */}
        <div className="absolute top-64 flex gap-6 animate-[slide-left_40s_linear_infinite] whitespace-nowrap">
          {[...places, ...places, ...places].map((place, index) => (
            <div
              key={`row2-${index}`}
              className="relative h-48 w-80 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg"
            >
              <div className={`h-full w-full bg-gradient-to-br ${place.color}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-4 text-white font-bold text-lg">
                {place.name}
              </p>
            </div>
          ))}
        </div>

        {/* Third Row - Moving Right */}
        <div className="absolute top-[32rem] flex gap-6 animate-[slide-right_40s_linear_infinite] whitespace-nowrap">
          {[...places, ...places, ...places].map((place, index) => (
            <div
              key={`row3-${index}`}
              className="relative h-48 w-80 flex-shrink-0 rounded-2xl overflow-hidden shadow-lg"
            >
              <div className={`h-full w-full bg-gradient-to-br ${place.color}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-4 text-white font-bold text-lg">
                {place.name}
              </p>
            </div>
          ))}
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-sm" />
      </div>

      {/* Auth Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#fcaa13] to-[#fb6b10] bg-clip-text text-transparent">
              VoyageAI
            </h1>
            <p className="text-muted-foreground">Your AI travel companion</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="border-2 backdrop-blur-md bg-card/95 shadow-xl">
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-[#fcaa13] to-[#fb6b10] hover:from-[#fb6b10] hover:to-[#ef420f]">
                      Login
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="border-2 backdrop-blur-md bg-card/95 shadow-xl">
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>Start your journey with VoyageAI</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-[#fcaa13] to-[#fb6b10] hover:from-[#fb6b10] hover:to-[#ef420f]">
                      Sign Up
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;