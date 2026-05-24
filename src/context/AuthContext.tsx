"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface CloudinaryConfig {
  folderName: string;
  unsignedUploadPreset: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  hasPin: boolean;
  isLocked: boolean;
  tempPin: string | null;
  cloudConnected: boolean;
  cloudinaryConfig: CloudinaryConfig | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  unlockApp: (pin: string) => Promise<void>;
  setTempPin: (pin: string) => void;
  clearTempPin: () => void;
  setPinAndUnlock: (pin: string) => Promise<void>;
  saveCloudinaryConfig: (folderName: string, unsignedUploadPreset: string) => Promise<void>;
  fetchCloudinaryStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPin, setHasPin] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [tempPin, setTempPinState] = useState<string | null>(null);
  const [cloudConnected, setCloudConnected] = useState(false);
  const [cloudinaryConfig, setCloudinaryConfig] = useState<CloudinaryConfig | null>(null);
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
          setIsLocked(true);
        }

        // Check Cloudinary status
        await fetchCloudinaryStatus();
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const fetchCloudinaryStatus = async () => {
    try {
      const response = await api.get("/cloudinary/config");
      setCloudConnected(true);
      setCloudinaryConfig(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setCloudConnected(false);
        setCloudinaryConfig(null);
      } else {
        console.error("Failed to fetch Cloudinary status", error);
      }
    }
  };

  const saveCloudinaryConfig = async (folderName: string, unsignedUploadPreset: string) => {
    await api.post("/cloudinary/config", { folderName, unsignedUploadPreset });
    await fetchCloudinaryStatus(); // refresh status
  };

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

    await fetchCloudinaryStatus();
  };

  const register = async (name: string, email: string, password: string) => {
    await api.post("/auth/register", { name, email, password });
    router.push("/login?registered=true");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setHasPin(false);
    setIsLocked(false);
    setCloudConnected(false);
    setCloudinaryConfig(null);
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
        cloudConnected,
        cloudinaryConfig,
        login,
        register,
        logout,
        unlockApp,
        setTempPin,
        clearTempPin,
        setPinAndUnlock,
        saveCloudinaryConfig,
        fetchCloudinaryStatus,
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