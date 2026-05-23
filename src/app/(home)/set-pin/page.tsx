"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import DialPad from "@/components/DialPad";
import { useAuth } from "@/context/AuthContext";

export default function SetPinPage() {
  const { user, loading, hasPin, setTempPin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (!loading && hasPin) {
      router.push("/");
    }
  }, [user, loading, hasPin, router]);

  if (loading || !user || hasPin) return null;

  const handlePinEnter = (pin: string) => {
    setTempPin(pin);
    router.push("/confirm-pin");
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-dark-green">
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
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-white/80">
              Set App Lock
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Create a 6‑digit PIN
          </h2>
          <p className="text-white/60 mb-6">
            This PIN will lock your FileFortress app
          </p>

          <DialPad onComplete={handlePinEnter} />
        </div>
      </motion.div>
    </div>
  );
}