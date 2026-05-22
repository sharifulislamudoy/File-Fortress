// src/app/(home)/page.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mic, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-dark-green">
      {/* Animated Grid Background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(transparent, transparent 39px, rgba(74, 222, 128, 0.15) 39px, rgba(74, 222, 128, 0.15) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(74, 222, 128, 0.15) 39px, rgba(74, 222, 128, 0.15) 40px)
          `,
          backgroundSize: "40px 40px",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "40px 40px"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
      />

      {/* Floating Particles / Glow Effects */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-white/80">
              End-to-End Encrypted Storage
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Your Files, Your
            <span className="text-emerald-400 block sm:inline"> Private Cloud</span>
          </h1>

          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
            Organize files and folders just like your PC. Military-grade encryption,
            voice-controlled navigation, and secure cloud backup.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-full flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/25"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}