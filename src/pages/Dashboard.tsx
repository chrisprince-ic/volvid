import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Video, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { db, collection, onSnapshot, query, where, orderBy, Timestamp, doc, updateDoc } from "@/lib/firebase";
import { useTheme } from "next-themes";

type VideoData = {
  id: string;
  url: string;
  prompt?: string;
  aspectRatio?: string;
  duration?: string;
  taskId?: string;
  createdAt?: Timestamp | Date | null;
};

const Dashboard = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle theme toggle and save to Firebase
  const handleThemeToggle = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    
    // Save to Firebase
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { theme: newTheme });
      } catch (err) {
        console.error("Failed to save theme preference:", err);
      }
    }
  };

  useEffect(() => {
    if (!user) {
      setVideos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let unsubscribe: (() => void) | undefined;

    const setupListener = (useOrderBy: boolean) => {
      const base = [collection(db, "videos"), where("uid", "==", user.uid)] as const;
      const qRef = useOrderBy ? query(...base, orderBy("createdAt", "desc")) : query(...base);

      unsubscribe = onSnapshot(
        qRef,
        (snap) => {
          let data: VideoData[] = snap.docs.map((d) => {
            const docData = d.data() as any;
            return {
              id: d.id,
              url: docData.url || "",
              prompt: docData.prompt,
              aspectRatio: docData.aspectRatio,
              duration: docData.duration,
              taskId: docData.taskId,
              createdAt: docData.createdAt || null,
            };
          });
          if (!useOrderBy) {
            data = data.sort((a, b) => {
              const ta = (a.createdAt as any)?.toMillis?.() ?? 0;
              const tb = (b.createdAt as any)?.toMillis?.() ?? 0;
              return tb - ta;
            });
          }
          setVideos(data);
          setLoading(false);
        },
        (err) => {
          // If index is missing, retry without orderBy
          if (String(err?.message || "").includes("requires an index")) {
            if (unsubscribe) unsubscribe();
            setupListener(false);
            return;
          }
          console.error("Error fetching videos:", err);
          setError("Failed to load videos. Please try again.");
          setLoading(false);
        }
      );
    };

    setupListener(true);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between mt-8 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome{user ? `, ${user.displayName?.split(" ")[0] || ""}` : "!"}</h1>
            <p className="text-muted-foreground">Ready to create something amazing?</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleThemeToggle}
            className="rounded-full"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
        </div>

        <Card className="glass-card p-8 relative overflow-hidden">
          <div className="absolute inset-0 gradient-radial opacity-50" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Create Your Next Video</h2>
              <p className="text-muted-foreground mb-4">Turn your ideas into cinematic AI videos in minutes</p>
              <Link to="/dashboard/create">
                <Button size="lg" className="glow-primary">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Creating
                </Button>
              </Link>
            </div>
            <Video className="w-32 h-32 text-primary/20" />
          </div>
        </Card>

        {/* Stats */}
        {user && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-2">
                <Video className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold mb-1">{videos.length}</div>
              <div className="text-sm text-muted-foreground">Videos Created</div>
            </Card>
          </div>
        )}

        {/* Videos Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Your Videos</h2>
            {videos.length > 0 && (
              <Link to="/dashboard/videos">
                <Button variant="ghost">View All</Button>
              </Link>
            )}
          </div>
          {loading ? (
            <div className="text-muted-foreground">Loading your videos...</div>
          ) : error ? (
            <div className="text-destructive">{error}</div>
          ) : !user ? (
            <div className="text-muted-foreground">Sign in to see your videos.</div>
          ) : videos.length === 0 ? (
            <div className="text-muted-foreground">No videos yet. Create your first one!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videos.slice(0, 6).map((v) => (
                <Card key={v.id} className="glass-card overflow-hidden group">
                  <div className="relative">
                    <video src={v.url} className="w-full aspect-video object-cover" controls playsInline />
                  </div>
                  {v.prompt && (
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">{v.prompt}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
