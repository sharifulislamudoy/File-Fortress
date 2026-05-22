// components/InitialLoader.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";

interface InitialLoaderProps {
  children: React.ReactNode;
}

const COOLDOWN_HOURS = 1;
const MIN_DISPLAY_MS = 3000; // 3 seconds minimum display

export default function InitialLoader({ children }: InitialLoaderProps) {
  const [showLoader, setShowLoader] = useState(true);
  const [shouldSkip, setShouldSkip] = useState(false);

  useEffect(() => {
    // Check localStorage for last loading time
    const lastLoadingTime = localStorage.getItem("last_loading_time");
    const now = Date.now();
    
    if (lastLoadingTime) {
      const lastTime = parseInt(lastLoadingTime, 10);
      const hoursPassed = (now - lastTime) / (1000 * 60 * 60);
      
      if (hoursPassed < COOLDOWN_HOURS) {
        // Within cooldown period, skip loading screen
        setShouldSkip(true);
        setShowLoader(false);
        return;
      }
    }
    
    // Need to show loading screen
    setShouldSkip(false);
    
    // Store current time immediately to prevent showing again during min display
    localStorage.setItem("last_loading_time", now.toString());
    
    // Ensure loader shows for at least MIN_DISPLAY_MS
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, MIN_DISPLAY_MS);
    
    return () => clearTimeout(timer);
  }, []);

  // If skipping, render children immediately
  if (shouldSkip) {
    return <>{children}</>;
  }

  // Show loading screen while loading
  return (
    <AnimatePresence mode="wait">
      {showLoader ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: "fixed", inset: 0, zIndex: 9999 }}
        >
          <LoadingSpinner />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}