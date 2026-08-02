"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiFetch, isDefinitiveAuthError } from "@/lib/api";
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
  type AuthUser,
} from "@/lib/auth";
import type { IUser } from "@/lib/types";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  loginWithToken: (accessToken: string) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applyUser = useCallback((next: AuthUser | null) => {
    setUser(next);
    if (next) {
      setStoredUser(next);
    } else {
      clearStoredUser();
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await apiFetch<{ user: IUser }>("/auth/me");
      applyUser({
        id: res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role,
      });
    } catch {
      applyUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [applyUser]);

  useEffect(() => {
    let active = true;
    apiFetch<{ user: IUser }>("/auth/me")
      .then((res) => {
        if (!active) return;
        const next = {
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role,
        };
        setUser(next);
        setStoredUser(next);
      })
      .catch((err) => {
        if (!active) return;
        if (isDefinitiveAuthError(err)) {
          setUser(null);
          clearStoredUser();
          return;
        }
        const fallback = getStoredUser();
        if (fallback) setUser(fallback);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const loginWithToken = useCallback(
    (accessToken: string) => {
      const payload = getUserFromToken(accessToken);
      if (payload) {
        applyUser(payload);
        refreshUser();
      }
    },
    [applyUser, refreshUser],
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore network errors during logout
    }
    applyUser(null);
  }, [applyUser]);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, loginWithToken, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function getUserFromToken(token: string): AuthUser | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const payload = JSON.parse(json);
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role as AuthUser["role"],
    };
  } catch {
    return null;
  }
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
