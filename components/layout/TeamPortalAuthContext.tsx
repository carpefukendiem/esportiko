"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createBrowserClientIfConfigured } from "@/lib/supabase/client";

type TeamPortalAuthState = {
  user: User | null;
  teamName: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const TeamPortalAuthContext = createContext<TeamPortalAuthState | null>(null);

async function resolveTeamName(user: User): Promise<string> {
  const supabase = createBrowserClientIfConfigured();
  if (!supabase) {
    const meta = user.user_metadata?.team_name;
    if (typeof meta === "string" && meta.trim()) return meta.trim();
    return user.email?.split("@")[0]?.replace(/\./g, " ") ?? "My team";
  }
  const { data } = await supabase
    .from("accounts")
    .select("team_name")
    .eq("user_id", user.id)
    .maybeSingle();

  const fromRow = data?.team_name?.trim();
  if (fromRow) return fromRow;

  const meta = user.user_metadata?.team_name;
  if (typeof meta === "string" && meta.trim()) return meta.trim();

  const emailLocal = user.email?.split("@")[0]?.replace(/\./g, " ");
  if (emailLocal) return emailLocal;

  return "My team";
}

export function TeamPortalAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const resolveGen = useRef(0);

  const applySession = useCallback(async (next: Session | null) => {
    const gen = ++resolveGen.current;
    setSession(next);
    if (!next?.user) {
      setTeamName(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const name = await resolveTeamName(next.user);
      if (gen !== resolveGen.current) return;
      setTeamName(name);
    } catch {
      if (gen !== resolveGen.current) return;
      setTeamName(
        next.user.email?.split("@")[0]?.replace(/\./g, " ") ?? "My team"
      );
    } finally {
      if (gen === resolveGen.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const supabase = createBrowserClientIfConfigured();
    if (!supabase) {
      setLoading(false);
      return;
    }
    let alive = true;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!alive) return;
      void applySession(s);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      void applySession(s);
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, [applySession]);

  const signOut = useCallback(async () => {
    const supabase = createBrowserClientIfConfigured();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setTeamName(null);
    setLoading(false);
  }, []);

  const value = useMemo<TeamPortalAuthState>(
    () => ({
      user: session?.user ?? null,
      teamName,
      loading,
      signOut,
    }),
    [session?.user, teamName, loading, signOut]
  );

  return (
    <TeamPortalAuthContext.Provider value={value}>
      {children}
    </TeamPortalAuthContext.Provider>
  );
}

export function useTeamPortalAuth(): TeamPortalAuthState {
  const ctx = useContext(TeamPortalAuthContext);
  if (!ctx) {
    throw new Error("useTeamPortalAuth must be used within TeamPortalAuthProvider");
  }
  return ctx;
}
