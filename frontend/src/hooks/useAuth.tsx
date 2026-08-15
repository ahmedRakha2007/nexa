import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@/types";

const USER_STORAGE_KEY = "nexa.user";
const TOKEN_STORAGE_KEY = "nexa.token";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  signIn: (user: User, token: string) => void;
  signOut: () => void;
  updateUser: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const rawUser = window.localStorage.getItem(USER_STORAGE_KEY);
      const rawToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);

      if (rawUser) {
        setUser(JSON.parse(rawUser) as User);
      }

      if (rawToken) {
        setToken(rawToken);
      }
    } catch (error) {
      console.log(error);
    }

    setHydrated(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      hydrated,

      signIn: (nextUser, nextToken) => {
        setUser(nextUser);
        setToken(nextToken);

        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));

        window.localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
      },

      signOut: () => {
        setUser(null);
        setToken(null);

        window.localStorage.removeItem(USER_STORAGE_KEY);
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      },

      updateUser: (patch) => {
        setUser((prev) => {
          if (!prev) return prev;

          const next = { ...prev, ...patch };

          window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(next));

          return next;
        });
      },
    }),
    [user, token, hydrated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}
