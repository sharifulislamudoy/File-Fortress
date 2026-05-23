"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  hasPin: boolean;
  isLocked: boolean;
  tempPin: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  unlockApp: (pin: string) => Promise<void>;
  setTempPin: (pin: string) => void;
  clearTempPin: () => void;
  setPinAndUnlock: (pin: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPin, setHasPin] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [tempPin, setTempPinState] = useState<string | null>(null);
  const router = useRouter();

  // Load user and PIN status on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        setUser(response.data);

        // Check PIN status
        const pinCheck = await api.get("/pin/check");
        setHasPin(pinCheck.data.hasPin);
        if (pinCheck.data.hasPin) {
          setIsLocked(true); // app starts locked
        }
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", response.data.token);
    setUser({ _id: response.data._id, name: response.data.name, email: response.data.email });

    const pinCheck = await api.get("/pin/check");
    setHasPin(pinCheck.data.hasPin);
    if (pinCheck.data.hasPin) {
      setIsLocked(true);
      router.push("/");
    } else {
      router.push("/set-pin");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    await api.post("/auth/register", { name, email, password });
    // Do NOT store token – user must login manually
    router.push("/login?registered=true");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setHasPin(false);
    setIsLocked(false);
    router.push("/login");
  };

  const unlockApp = async (pin: string) => {
    await api.post("/pin/verify", { pin });
    setIsLocked(false);
  };

  const setTempPin = (pin: string) => {
    setTempPinState(pin);
  };

  const clearTempPin = () => {
    setTempPinState(null);
  };

  const setPinAndUnlock = async (pin: string) => {
    await api.post("/pin/set", { pin });
    setHasPin(true);
    setIsLocked(false);
    clearTempPin();
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        hasPin,
        isLocked,
        tempPin,
        login,
        register,
        logout,
        unlockApp,
        setTempPin,
        clearTempPin,
        setPinAndUnlock,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}