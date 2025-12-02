import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Account = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your account settings have been updated successfully",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>

        <Card className="glass-card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Profile</h2>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div>
              <Button variant="outline" size="sm">Change Avatar</Button>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-card"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-card"
              />
            </div>

            <Button onClick={handleSave} className="glow-primary">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </Card>

        <Card className="glass-card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Password</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Current Password</label>
              <Input type="password" className="glass-card" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">New Password</label>
              <Input type="password" className="glass-card" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Confirm New Password</label>
              <Input type="password" className="glass-card" />
            </div>
            <Button variant="outline">Update Password</Button>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4">Support</h2>
          <p className="text-muted-foreground mb-4">
            Need help? Our support team is here for you.
          </p>
          <Button variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Account;
