"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  AuthResponse,
  UserProfileResponse,
  LoginUserCommand,
} from "../lib/types";
import {
  getProfile,
  login as apiLogin,
  logout as apiLogout,
  setAuthToken,
} from "../lib/services/api";

interface AuthContextValue {
  user: UserProfileResponse | null;
  token: string | null;
  loading: boolean;
  loginWithEmail: (payload: LoginUserCommand) => Promise<AuthResponse | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}`;
}

function clearCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t =
      getCookie("accessToken") ||
      (typeof localStorage !== "undefined"
        ? localStorage.getItem("accessToken")
        : null);
    if (t) {
      setAuthToken(t);
      setToken(t);
      getProfile()
        .then((p) => {
          setUser(p);
          if (p?.roles?.length) {
            setCookie("roles", p.roles.join(","), 1800);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginWithEmail = async (
    payload: LoginUserCommand
  ): Promise<AuthResponse | null> => {
    const res = await apiLogin(payload);
    console.log(res);

    if (res?.accessToken) {
      setAuthToken(res.accessToken);
      setToken(res.accessToken);
      try {
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
      } catch {}
      setCookie("accessToken", res.accessToken, 1800);
      try {
        const profile = await getProfile();
        setUser(profile);
        if (profile?.roles?.length) {
          setCookie("roles", profile.roles.join(","), 1800);
        }
      } catch {}
      return res;
    }
    return null;
  };

  const logout = async (): Promise<void> => {
    try {
      await apiLogout();
    } catch {}
    setUser(null);
    setToken(null);
    setAuthToken(null);
    clearCookie("accessToken");
    clearCookie("roles");
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } catch {}
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, loading, loginWithEmail, logout }),
    [user, token, loading]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
