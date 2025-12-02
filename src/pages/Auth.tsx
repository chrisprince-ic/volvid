import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Video, Mail, Lock, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signInWithGoogle, user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Placeholder auth logic
    if (isSignUp) {
      toast({
        title: "🎉 Welcome to VolVid AI!",
        description: "You've received 50 free credits — enough for 10 videos!",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account.",
      });
    }
    
    // Navigate to dashboard
    setTimeout(() => navigate("/dashboard"), 1000);
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 gradient-radial" />
      
      <Card className="glass-card p-8 w-full max-w-md relative z-10 animate-scale-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Video className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">VolVid AI</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">
            {isSignUp ? "Start Creating" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp 
              ? "Get 50 free credits to create amazing videos" 
              : "Sign in to continue your creative journey"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-card"
                required
              />
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-card pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-card pl-10"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full glow-primary" size="lg">
            {isSignUp ? (
              <>
                Sign Up Free
                <Sparkles className="w-4 h-4 ml-2" />
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <Button type="button" onClick={signInWithGoogle} className="w-full" variant="outline">
            Continue with Google
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isSignUp ? (
              <>Already have an account? <span className="text-primary font-medium">Sign In</span></>
            ) : (
              <>Don't have an account? <span className="text-primary font-medium">Sign Up</span></>
            )}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
