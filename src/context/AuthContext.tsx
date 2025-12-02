import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, onAuthStateChanged, signInWithGooglePopup, signOutUser, type User, db, doc, getDoc, setDoc, onSnapshot, updateDoc } from "@/lib/firebase";
import { useTheme } from "next-themes";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  credits: number | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  credits: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);
  const { setTheme } = useTheme();
  
  // Ensure a user doc exists with initial credits
  const ensureUserDoc = async (u: User) => {
    try {
      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, { credits: 50, theme: "dark", createdAt: Date.now() });
      }
    } catch (e) {
      // Non-fatal
      console.error("ensureUserDoc error", e);
    }
  };

  useEffect(() => {
    let unsubCredits: (() => void) | undefined;
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await ensureUserDoc(u);
        const ref = doc(db, "users", u.uid);
        unsubCredits = onSnapshot(ref, (snap) => {
          const data = snap.data() as any;
          setCredits(data?.credits ?? null);
          // Load theme preference from Firebase
          if (data?.theme && (data.theme === "light" || data.theme === "dark")) {
            setTheme(data.theme);
          }
        });
      } else {
        setCredits(null);
        if (unsubCredits) unsubCredits();
      }
      setLoading(false);
    });
    return () => {
      if (unsubCredits) unsubCredits();
      unsub();
    };
  }, [setTheme]);

  const signInWithGoogle = async () => {
    await signInWithGooglePopup();
  };

  const signOut = async () => {
    await signOutUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, credits }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


