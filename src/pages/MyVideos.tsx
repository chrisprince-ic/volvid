import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { db, collection, onSnapshot, query, where, orderBy } from "@/lib/firebase";

const MyVideos = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Array<{ id: string; url: string; createdAt?: any }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setVideos([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    let unsubscribe: (() => void) | undefined;

    const setupListener = (useOrderBy: boolean) => {
      const base = [collection(db, "videos"), where("uid", "==", user.uid)] as const;
      const qRef = useOrderBy ? query(...base, orderBy("createdAt", "desc")) : query(...base);
      unsubscribe = onSnapshot(
        qRef,
        (snap) => {
          let data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
          if (!useOrderBy) {
            data = data.sort((a: any, b: any) => {
              const ta = a?.createdAt?.toMillis?.() ?? 0;
              const tb = b?.createdAt?.toMillis?.() ?? 0;
              return tb - ta;
            });
          }
          setVideos(data);
          setLoading(false);
        },
        (err) => {
          if (String(err?.message || "").includes("requires an index")) {
            if (unsubscribe) unsubscribe();
            setupListener(false);
            return;
          }
          console.error("Error fetching videos:", err);
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
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Videos</h1>
            <p className="text-muted-foreground">All your AI-generated creations in one place</p>
          </div>
        </div>

        {loading ? (
          <div className="text-muted-foreground">Loading your videos...</div>
        ) : !user ? (
          <div className="text-muted-foreground">Sign in to see your videos.</div>
        ) : videos.length === 0 ? (
          <div className="text-muted-foreground">No videos yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v) => (
              <Card key={v.id} className="glass-card overflow-hidden group">
                <div className="relative">
                  <video src={v.url} className="w-full aspect-video object-cover" controls playsInline />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyVideos;
