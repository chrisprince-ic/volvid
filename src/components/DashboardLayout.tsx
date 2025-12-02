import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Video, Sparkles, FileVideo, CreditCard, Settings, LogOut, Bell, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Sparkles, label: "Create Video", path: "/dashboard/create" },
    { icon: FileVideo, label: "My Videos", path: "/dashboard/videos" },
    { icon: CreditCard, label: "Billing", path: "/dashboard/billing" },
    { icon: Settings, label: "Account", path: "/dashboard/account" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 glass-card border-r fixed left-0 top-0 bottom-0 z-30">
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-2">
            <Video className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-primary">VolVid AI</span>
          </Link>
        </div>
        
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 transition-all",
                    isActive && "bg-primary/20 text-primary glow-primary"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="glass-card border-b h-16 fixed top-0 right-0 left-64 z-20 flex items-center justify-between px-6 shadow-none" style={{ boxShadow: 'none' }}>
          <div className="flex-1" />
          
          <div className="flex items-center gap-4">
            <CreditsBadge />
            
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="pt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const CreditsBadge = () => {
  const { credits } = useAuth();
  return (
    <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-primary" />
      <span className="font-semibold">{typeof credits === "number" ? `${credits} Credits` : "Credits"}</span>
    </div>
  );
};

export default DashboardLayout;
