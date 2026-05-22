// components/LoadingSpinner.tsx
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function LoadingSpinner() {
    const [isVisible, setIsVisible] = useState(true);
    const [statusText, setStatusText] = useState("Unlocking...");

    useEffect(() => {
        // 1.9 second por chabi ghurar sathe sathe text update hobe
        const textTimer = setTimeout(() => {
            setStatusText("Unlocked!");
        }, 1900);

        // Thik 3 second por puro component ti hide hoye jabe
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        return () => {
            clearTimeout(textTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    // 3s pore component unmount hoye jabe
    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed inset-0 flex flex-col items-center justify-center z-50"
            // Puro background 3s er sheshe smoothly fade out hobe
            animate={{ opacity: [0, 1, 1, 1, 0] }}
            transition={{ duration: 3, times: [0, 0.1, 0.8, 0.9, 1], ease: "easeInOut" }}
        >
            <motion.div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
            repeating-linear-gradient(transparent, transparent 39px, rgba(74, 222, 128, 0.1) 39px, rgba(74, 222, 128, 0.1) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(74, 222, 128, 0.1) 39px, rgba(74, 222, 128, 0.1) 40px)
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

            {/* Glow effects */}
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
            <div className="relative w-40 h-40 flex items-center justify-center">

                {/* Unlock Glow Effect - Tala khular somoy glow hobe */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-emerald-500 blur-2xl"
                    animate={{
                        scale: [0.5, 0.5, 0.5, 1.2, 1.5],
                        opacity: [0, 0, 0, 0.4, 0],
                    }}
                    transition={{
                        duration: 3,
                        times: [0, 0.5, 0.6, 0.7, 1],
                        ease: "easeOut",
                    }}
                />

                {/* Lock & Key SVG */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [0.9, 1, 1, 1.05, 1, 1] }}
                    transition={{ duration: 3, times: [0, 0.1, 0.6, 0.65, 0.75, 1] }}
                >
                    <svg
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="overflow-visible"
                    >
                        {/* Lock Shackle (Talar uporer angsho, khular somoy upore uthbe) */}
                        <motion.g
                            animate={{ y: [0, 0, 0, -12, -12] }}
                            transition={{ duration: 3, times: [0, 0.5, 0.6, 0.7, 1], ease: "backOut" }}
                        >
                            <path
                                d="M30 40 V25 C30 14 39 5 50 5 C61 5 70 14 70 25 V40"
                                stroke="#4ade80"
                                strokeWidth="6"
                                strokeLinecap="round"
                                fill="none"
                            />
                        </motion.g>

                        {/* Lock Body */}
                        <rect
                            x="20"
                            y="40"
                            width="60"
                            height="48"
                            rx="10"
                            fill="#064e3b"
                            stroke="#4ade80"
                            strokeWidth="5"
                        />

                        {/* Keyhole (Chabi dhukanor gorto) */}
                        <circle cx="50" cy="58" r="8" fill="none" stroke="#4ade80" strokeWidth="3" />
                        <rect x="47" y="62" width="6" height="10" rx="1.5" fill="#4ade80" />

                        {/* Animated Key (Chabi) */}
                        <motion.g
                            animate={{
                                // 1. Enter, 2. Insert, 3. Turn 90deg, 4. Hold
                                x: [0, 35, 35, 35, 35],
                                y: [80, 58, 58, 58, 58],
                                rotate: [-45, 0, 0, 90, 90],
                                opacity: [0, 1, 1, 1, 1]
                            }}
                            transition={{
                                duration: 3,
                                times: [0, 0.2, 0.4, 0.6, 1],
                                ease: "easeInOut",
                            }}
                        >
                            {/* Key Shaft */}
                            <rect x="0" y="-2" width="22" height="4" rx="2" fill="#4ade80" />
                            {/* Key Bow (handle) */}
                            <circle cx="-8" cy="0" r="8" stroke="#4ade80" strokeWidth="3" fill="#0f172a" />
                            <circle cx="-8" cy="0" r="3" fill="#4ade80" />
                            {/* Key Teeth */}
                            <rect x="10" y="2" width="4" height="5" rx="1" fill="#4ade80" />
                            <rect x="16" y="2" width="3" height="4" rx="1" fill="#4ade80" />
                        </motion.g>
                    </svg>
                </motion.div>
            </div>

            {/* Status Text */}
            <motion.p
                className="mt-6 text-emerald-400 font-medium tracking-widest text-lg"
                animate={{ opacity: [0, 1, 1, 1, 0] }}
                transition={{ duration: 3, times: [0, 0.1, 0.8, 0.9, 1] }}
            >
                {statusText}
            </motion.p>
        </motion.div>
    );
}
