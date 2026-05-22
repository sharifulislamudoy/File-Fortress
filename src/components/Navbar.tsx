// src/components/Navbar.tsx
"use client";

import { motion } from "framer-motion";
import { FolderLock, User, Home, FolderTree, Mic, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
              <NavLink href="/" icon={<Home className="w-4 h-4" />}>
                Home
              </NavLink>
              <NavLink href="/files" icon={<FolderTree className="w-4 h-4" />}>
                My Files
              </NavLink>

              {/* Voice Assistant Indicator */}
              <button
                onClick={() => setIsVoiceActive(!isVoiceActive)}
                className={`relative p-2 rounded-full transition-all ${
                  isVoiceActive
                    ? "bg-emerald-500 text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                <Mic className="w-5 h-5" />
                {isVoiceActive && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-emerald-500"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ zIndex: -1 }}
                  />
                )}
              </button>
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
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <button
                    onClick={() => {/* handle logout */}}
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
          <MobileNavLink href="/" icon={<Home className="w-5 h-5" />} label="Home" />
          <MobileNavLink href="/files" icon={<FolderTree className="w-5 h-5" />} label="Files" />
          <button
            onClick={() => setIsVoiceActive(!isVoiceActive)}
            className={`relative flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
              isVoiceActive ? "text-emerald-400" : "text-white/60"
            }`}
          >
            <Mic className="w-5 h-5" />
            <span className="text-[10px] mt-1">Voice</span>
            {isVoiceActive && (
              <motion.span
                className="absolute inset-0 rounded-lg bg-emerald-500/30"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ zIndex: -1 }}
              />
            )}
          </button>
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
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                >
                  <User className="w-4 h-4" /> Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
                >
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                <button
                  onClick={() => {/* handle logout */}}
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

// Desktop Nav Link component
function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium group"
    >
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      {children}
    </Link>
  );
}

// Mobile Nav Link component
function MobileNavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center p-2 rounded-lg text-white/60 hover:text-emerald-400 transition-colors"
    >
      {icon}
      <span className="text-[10px] mt-1">{label}</span>
    </Link>
  );
}