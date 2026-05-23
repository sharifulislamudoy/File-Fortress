"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock } from "lucide-react";
import DialPad from "./DialPad";
import { useAuth } from "@/context/AuthContext";

export default function UnlockPage() {
  const [error, setError] = useState("");
  const { unlockApp } = useAuth();

  const handlePinEnter = async (pin: string) => {
    setError("");
    try {
      await unlockApp(pin);
    } catch (err: any) {
      setError(err.response?.data?.message || "Incorrect PIN");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-green">
      {/* Same animated background as other auth pages */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(transparent, transparent 39px, rgba(74, 222, 128, 0.1) 39px, rgba(74, 222, 128, 0.1) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(74, 222, 128, 0.1) 39px, rgba(74, 222, 128, 0.1) 40px)
          `,
          backgroundSize: "40px 40px",
        }}
        animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-emerald-500/20 p-8 shadow-2xl text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6 border border-white/20">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-white/80">
              App Locked
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Enter your PIN</h2>
          <p className="text-white/60 mb-6">to unlock FileFortress</p>

          <DialPad onComplete={handlePinEnter} error={error} />
        </div>
      </motion.div>
    </div>
  );
}