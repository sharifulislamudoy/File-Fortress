"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Delete } from "lucide-react";

interface DialPadProps {
  onComplete: (pin: string) => void; // called when 6 digits are entered
  error?: string;
  label?: string;
}

export default function DialPad({ onComplete, error, label }: DialPadProps) {
  const [pin, setPin] = useState<string[]>([]);

  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      const newPin = [...pin, num];
      setPin(newPin);
      if (newPin.length === 6) {
        onComplete(newPin.join(""));
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "delete"];

  return (
    <div className="flex flex-col items-center gap-6">
      {label && (
        <p className="text-white/80 text-sm font-medium text-center">{label}</p>
      )}
      {/* PIN Dots Display */}
      <div className="flex gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-colors ${
              i < pin.length
                ? "bg-emerald-400 border-emerald-400"
                : "border-white/30 bg-transparent"
            }`}
          />
        ))}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-sm text-center"
        >
          {error}
        </motion.p>
      )}

      {/* Dial Grid */}
      <div className="grid grid-cols-3 gap-4 max-w-[240px] mx-auto">
        {digits.map((digit) => {
          if (digit === "") return <div key="empty" />;
          if (digit === "delete") {
            return (
              <button
                key="delete"
                type="button"
                onClick={handleDelete}
                className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <Delete className="w-6 h-6" />
              </button>
            );
          }
          return (
            <button
              key={digit}
              type="button"
              onClick={() => handleNumberClick(digit)}
              className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-2xl font-semibold hover:scale-105 transition-all"
            >
              {digit}
            </button>
          );
        })}
      </div>
    </div>
  );
}