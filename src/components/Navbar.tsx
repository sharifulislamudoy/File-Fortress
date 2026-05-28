"use client";

import { motion } from "framer-motion";
import { FolderLock, User, Home, FolderTree, Mic, LogOut, Settings, Cloud, CloudOff } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout, cloudConnected, cloudinaryConfig } = useAuth();

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".profile-menu")) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      {/* Desktop Navbar (sticky top) */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-dark-green/80 backdrop-blur-lg border-b border-emerald-500/20 hidden md:block"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <FolderLock className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-white font-bold text-xl">
                File<span className="text-emerald-400">Fortress</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="flex items-center gap-6">

              {/* Cloudinary Connection Status */}
              <Link
                href={cloudConnected ? "/files" : "/connect-cloudinary"}
                className="flex items-center gap-2 px-2 py-1 rounded-full transition-all"
              >
                {cloudConnected ? (
                  <div className="flex items-center gap-1 text-green-400">
                    <Cloud className="w-4 h-4" />
                    <span className="text-xs font-medium">Cloud Connected</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-400 animate-pulse">
                    <CloudOff className="w-4 h-4" />
                    <span className="text-xs font-medium">Connect Cloudinary</span>
                  </div>
                )}
              </Link>
            </div>

            {/* Profile Icon (Desktop) */}
            <div className="relative profile-menu">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors border border-emerald-500/30"
              >
                <User className="w-5 h-5" />
              </button>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-dark-green/95 backdrop-blur-md rounded-lg shadow-lg border border-emerald-500/20 py-1 z-50"
                >
                  <div className="px-4 py-2 text-sm text-white/60 border-b border-emerald-500/20">
                    {user?.name || user?.email}
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-green/95 backdrop-blur-lg border-t border-emerald-500/20">
        <div className="flex items-center justify-around py-2">
          {/* Cloud status for mobile */}
          <Link
            href={cloudConnected ? "/files" : "/connect-cloudinary"}
            className="flex flex-col items-center justify-center p-2 rounded-lg"
          >
            {cloudConnected ? (
              <>
                <Cloud className="w-5 h-5 text-green-400" />
                <span className="text-[10px] mt-1 text-green-400">Cloud</span>
              </>
            ) : (
              <>
                <CloudOff className="w-5 h-5 text-red-400 animate-pulse" />
                <span className="text-[10px] mt-1 text-red-400">Connect</span>
              </>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Top Bar with Logo & Profile Icon */}
      <div className="md:hidden sticky top-0 z-40 bg-dark-green/80 backdrop-blur-lg border-b border-emerald-500/20">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" className="flex items-center gap-2 group">
            <FolderLock className="w-6 h-6 text-emerald-400" />
            <span className="text-white font-bold text-lg">
              File<span className="text-emerald-400">Fortress</span>
            </span>
          </Link>
          <div className="relative profile-menu">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
            >
              <User className="w-4 h-4" />
            </button>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-dark-green/95 backdrop-blur-md rounded-lg shadow-lg border border-emerald-500/20 py-1 z-50"
              >
                <div className="px-4 py-2 text-sm text-white/60 border-b border-emerald-500/20">
                  {user?.name || user?.email}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
