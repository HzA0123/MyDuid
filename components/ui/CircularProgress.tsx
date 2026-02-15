"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
    value: number;
    size?: number;
    strokeWidth?: number;
    showText?: boolean;
}

export function CircularProgress({
    value,
    size = 120,
    strokeWidth = 10,
    showText = true,
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;
    const gradientId = `progress-gradient-${size}`;
    const glowId = `progress-glow-${size}`;

    const isComplete = value >= 100;
    const isHighProgress = value >= 75;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {isComplete && (
                <motion.div
                    animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.95, 1.02, 0.95] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-[-6px] rounded-full bg-amber-500/20 blur-lg"
                />
            )}

            <motion.div
                animate={{ opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={cn(
                    "absolute inset-[-3px] rounded-full blur-lg",
                    isComplete ? "bg-amber-400/20" : isHighProgress ? "bg-emerald-400/15" : "bg-teal-400/10"
                )}
            />

            <svg width={size} height={size} className="transform -rotate-90" style={{ overflow: "visible" }}>
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        {isComplete ? (
                            <>
                                <stop offset="0%" stopColor="#f59e0b" />
                                <stop offset="50%" stopColor="#fbbf24" />
                                <stop offset="100%" stopColor="#f59e0b" />
                            </>
                        ) : (
                            <>
                                <stop offset="0%" stopColor="#2dd4bf" />
                                <stop offset="100%" stopColor="#10b981" />
                            </>
                        )}
                    </linearGradient>
                    <filter id={glowId}>
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-white/[0.04]"
                />

                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth * 0.5}
                    fill="transparent"
                    strokeDasharray={`${strokeWidth * 0.5} ${strokeWidth * 2.5}`}
                    className="text-white/[0.03]"
                />

                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={`url(#${gradientId})`}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    filter={`url(#${glowId})`}
                />
            </svg>

            {showText && (
                <div className="absolute flex flex-col items-center justify-center text-white">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                        className={cn(
                            "font-bold tracking-tight",
                            size >= 140 ? "text-3xl" : "text-2xl",
                            isComplete && "text-amber-400"
                        )}
                    >
                        {Math.round(value)}%
                    </motion.span>
                    <span className={cn(
                        "text-[9px] uppercase tracking-[0.2em] font-semibold",
                        isComplete ? "text-amber-400/70" : "text-slate-500"
                    )}>
                        {isComplete ? "Complete" : "Funded"}
                    </span>
                </div>
            )}
        </div>
    );
}
