import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sparkles,
  Video,
  Zap,
  Lock,
  Shield,
  CheckCircle2,
  Users,
  TrendingUp,
  Award,
  ChevronDown,
  Menu,
  X,
  Star,
  ArrowRight,
  Globe,
  FileText,
  HelpCircle,
  Building2,
  BarChart3,
  PlayCircle,
  Image as ImageIcon,
  Film,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const samples = [
    { id: 1, title: "Cinematic Storytelling", url: "https://tempfile.aiquickdraw.com/f/40481b3c501b81c40aa24bb2ab39df1e/8b41d4e1-c8c5-4350-be43-fccb1c75793d.mp4" },
    { id: 2, title: "Product Showcase", url: "https://tempfile.aiquickdraw.com/f/5288c6e568541e45abe66c89d3af1c71/363373b7-f028-44f9-9849-1ddd91c0c623.mp4" },
    { id: 3, title: "Brand Campaign", url: "https://tempfile.aiquickdraw.com/f/e932f8129aaf924ce2561d47cc291b78/5fac08e3-dd79-42ac-90c0-1bb013fab50a.mp4" },
    { id: 4, title: "Social Media Content", url: "https://tempfile.aiquickdraw.com/f/1f1eee350c09802593a50b38956400ef/1517e3b3-9b0c-4bce-b6fb-64990cb27b36.mp4" },
    { id: 5, title: "Marketing Video", url: "https://tempfile.aiquickdraw.com/f/476d46fd558f193825dabbc0ea9da3d9/ac0096cf-1117-47fe-9106-997ad6f48776.mp4" },
  ];

  const features = [
    { icon: Sparkles, title: "AI-Powered Generation", desc: "State-of-the-art Sora AI technology for cinematic quality videos" },
    { icon: Video, title: "Multiple Formats", desc: "Text-to-video and image-to-video generation with custom aspect ratios" },
    { icon: Zap, title: "Lightning Fast", desc: "Generate professional videos in minutes, not hours or days" },
    { icon: Lock, title: "Enterprise Security", desc: "SOC 2 compliant with end-to-end encryption and private workspaces" },
    { icon: Shield, title: "Commercial License", desc: "Full commercial rights to all generated content" },
    { icon: TrendingUp, title: "Scalable API", desc: "RESTful API for enterprise integrations and automation" },
  ];

  const useCases = [
    { icon: Film, title: "Marketing & Advertising", desc: "Create engaging ad campaigns and promotional content" },
    { icon: Users, title: "Social Media", desc: "Generate viral-ready content for TikTok, Instagram, and YouTube" },
    { icon: Building2, title: "Corporate Training", desc: "Produce educational videos and training materials" },
    { icon: BarChart3, title: "E-commerce", desc: "Showcase products with dynamic video presentations" },
  ];

  const testimonials = [
    { name: "Sarah Chen", role: "Marketing Director", company: "TechCorp", content: "VolVid AI transformed our content creation process. We've reduced video production time by 90% while maintaining professional quality.", rating: 5 },
    { name: "Michael Rodriguez", role: "Creative Lead", company: "MediaStudio", content: "The AI understands context incredibly well. The videos we generate are indistinguishable from professionally produced content.", rating: 5 },
    { name: "Emily Johnson", role: "Founder", company: "StartupXYZ", content: "As a startup, we couldn't afford expensive video production. VolVid AI gave us enterprise-quality videos at a fraction of the cost.", rating: 5 },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      credits: 50,
      features: ["50 free credits", "10 video generations", "HD quality", "Standard support", "Commercial license"],
      popular: false,
    },
    {
      name: "Professional",
      price: "$29",
      credits: 360,
      period: "/month",
      features: ["360 credits/month", "72 video generations", "4K quality", "Priority support", "API access", "Custom branding"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      credits: "Unlimited",
      features: ["Unlimited credits", "Dedicated support", "Custom integrations", "SLA guarantee", "On-premise option", "Training & onboarding"],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b shadow-none" style={{ boxShadow: 'none' }}>
        <div className="section-container px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-primary">VolVid AI</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                  Features <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-card border">
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Text-to-Video</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>Image-to-Video</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Fast Generation</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Enterprise Security</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                  Solutions <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-card border">
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Film className="w-4 h-4" />
                    <span>Marketing & Ads</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Social Media</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Corporate Training</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>E-commerce</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="#pricing" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                  Resources <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-card border">
                  <DropdownMenuItem className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Documentation</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    <span>Help Center</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4" />
                    <span>Video Tutorials</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>API Reference</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                  Company <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-card border">
                  <DropdownMenuItem>About Us</DropdownMenuItem>
                  <DropdownMenuItem>Careers</DropdownMenuItem>
                  <DropdownMenuItem>Press Kit</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Contact Sales</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Auth Buttons / User Menu */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-3 px-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                        <AvatarFallback>
                          {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.displayName || user.email?.split("@")[0] || "User"}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 glass-card border" align="end">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.displayName || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <Link to="/dashboard">
                      <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                      onClick={signOut}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="ghost" className="flex items-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button className="glow-primary">Get Started</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 space-y-2 border-t pt-4">
              {user ? (
                <>
                  <div className="px-4 py-2 flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                      <AvatarFallback>
                        {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{user.displayName || user.email?.split("@")[0] || "User"}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-accent rounded-md flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button 
                    onClick={signOut}
                    className="w-full text-left px-4 py-2 hover:bg-accent rounded-md flex items-center gap-2 text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth" className="block px-4 py-2 hover:bg-accent rounded-md">
                    Sign In
                  </Link>
                  <Link to="/auth" className="block px-4 py-2 hover:bg-accent rounded-md">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 section relative overflow-hidden">
        <div className="absolute inset-0 gradient-radial opacity-50" />
        <div className="section-container text-center relative z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 mt-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Powered by Sora AI Technology</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight max-w-4xl mx-auto">
            Create Professional
            <br />
            <span className="text-primary">AI-Generated Videos</span>
            <br />
            in Minutes
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform text prompts and images into cinematic videos with enterprise-grade AI. 
            Trusted by 10,000+ creators and businesses worldwide.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span>Commercial License</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link to="/auth">
              <Button size="lg" className="glow-primary text-lg px-8 py-6 h-auto">
                Start Creating Free
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
              <PlayCircle className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            ✨ Get 50 free credits on signup — Create up to 10 professional videos
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500K+</div>
              <div className="text-sm text-muted-foreground">Videos Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">4.9/5</div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Videos */}
      <section className="section bg-muted/20">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">See It In Action</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real videos created by our users. No stock footage, no templates—just pure AI creativity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {samples.map((sample) => (
              <Card key={sample.id} className="glass-card overflow-hidden group hover:scale-[1.02] transition-all duration-300 hover:glow-primary">
                <div className="relative">
                  <video 
                    src={sample.url} 
                    className="w-full aspect-video object-cover" 
                    controls 
                    playsInline
                    preload="metadata"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{sample.title}</h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Enterprise-Grade Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create professional videos at scale
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="glass-card p-6 hover:glow-primary transition-all duration-300">
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section bg-muted/20">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Built For Every Industry</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From marketing teams to content creators, see how businesses use VolVid AI
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, idx) => (
              <Card key={idx} className="glass-card p-6 text-center hover:glow-primary transition-all duration-300">
                <useCase.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                <p className="text-muted-foreground text-sm">{useCase.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our customers say about VolVid AI
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="glass-card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section bg-muted/20">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include commercial license.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <Card 
                key={idx} 
                className={`glass-card p-8 relative ${plan.popular ? 'border-2 border-primary glow-primary' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <p className="text-muted-foreground">{plan.credits} credits</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/auth" className="block">
                  <Button 
                    className={`w-full ${plan.popular ? 'glow-primary' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                  >
                    {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>All plans include: Commercial license • 24/7 support • 99.9% uptime SLA</p>
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="section">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Enterprise Security & Compliance</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your data and content are protected with industry-leading security standards
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Shield, title: "SOC 2 Type II", desc: "Certified" },
              { icon: Lock, title: "End-to-End Encryption", desc: "256-bit SSL" },
              { icon: CheckCircle2, title: "GDPR Compliant", desc: "EU Data Protection" },
              { icon: Award, title: "ISO 27001", desc: "Information Security" },
            ].map((item, idx) => (
              <Card key={idx} className="glass-card p-6 text-center">
                <item.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 gradient-radial" />
        <div className="section-container text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to Transform Your Content?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of creators and businesses using VolVid AI to create professional videos at scale
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="glow-primary text-lg px-8 py-6 h-auto">
                Start Creating Free
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t glass-card py-16 px-6">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Video className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">VolVid AI</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                Creating the future of video content with enterprise-grade AI technology.
              </p>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <Globe className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Users className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link to="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Samples</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">API</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Changelog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">Marketing</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Social Media</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">E-commerce</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Enterprise</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Tutorials</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Community</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Press</Link></li>
                <li><Link to="#" className="hover:text-primary transition-colors">Partners</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © 2025 VolVid AI. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="#" className="hover:text-primary transition-colors">Cookie Policy</Link>
              <Link to="#" className="hover:text-primary transition-colors">Security</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
