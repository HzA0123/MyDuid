"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { LucideIcon } from "lucide-react";

interface NavLinkProps {
    href: string;
    icon: LucideIcon;
    label: string;
    isCollapsed?: boolean;
    active?: boolean;
    onClick?: () => void;
    className?: string;
    index?: number;
}

export function NavLink({ href, icon: Icon, label, isCollapsed = false, active, onClick, className, index = 0 }: NavLinkProps) {
    const [isHovered, setIsHovered] = useState(false);

    const staggerDelay = index * 0.04;

    return (
        <Link
            href={href}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                "flex items-center rounded-xl transition-all duration-200 group relative overflow-hidden",
                isCollapsed ? "justify-center px-2 py-3" : "px-4 py-3",
                active
                    ? "text-teal-400"
                    : "text-gray-500 hover:text-white",
                className
            )}
        >

            {active && (
                <motion.div
                    layoutId="activeNavBg"
                    className="absolute inset-0 rounded-xl bg-white/[0.06] border border-white/[0.08]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
            )}


            <AnimatePresence>
                {isHovered && !active && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 rounded-xl bg-white/[0.04]"
                    />
                )}
            </AnimatePresence>


            {active && (
                <motion.div
                    layoutId="activeNavBar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-teal-400 to-emerald-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
            )}


            <motion.div
                animate={{
                    scale: isHovered ? 1.15 : 1,
                    rotate: isHovered && !active ? [0, -8, 8, 0] : 0,
                }}
                transition={{
                    scale: { type: "spring", stiffness: 400, damping: 17 },
                    rotate: { duration: 0.4, ease: "easeInOut" },
                }}
                className="relative z-10 shrink-0"
            >
                <Icon
                    className={cn(
                        "w-5 h-5 transition-colors duration-200",
                        active ? "text-teal-400 drop-shadow-[0_0_6px_rgba(45,212,191,0.5)]" : "text-gray-500 group-hover:text-white"
                    )}
                />

                {active && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.8)]"
                    />
                )}
            </motion.div>


            <AnimatePresence mode="wait">
                {!isCollapsed && (
                    <motion.span
                        key="nav-label"
                        initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                        animate={{
                            opacity: 1,
                            width: "auto",
                            marginLeft: 16,
                        }}
                        exit={{
                            opacity: 0,
                            width: 0,
                            marginLeft: 0,
                        }}
                        transition={{
                            duration: 0.25,
                            delay: isCollapsed ? 0 : staggerDelay,
                            ease: [0.25, 0.46, 0.45, 0.94],
                            opacity: {
                                duration: 0.15,
                                delay: isCollapsed ? 0 : staggerDelay + 0.1,
                            },
                        }}
                        className="text-sm font-semibold relative z-10 whitespace-nowrap overflow-hidden"
                    >
                        {label}
                    </motion.span>
                )}
            </AnimatePresence>


            <AnimatePresence>
                {isCollapsed && isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: -4, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -4, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-full ml-3 z-[60] px-3 py-1.5 rounded-lg bg-slate-800/95 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/30"
                    >
                        <span className="text-xs font-semibold text-white whitespace-nowrap">{label}</span>

                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 rotate-45 bg-slate-800/95 border-l border-b border-white/10" />
                    </motion.div>
                )}
            </AnimatePresence>
        </Link>
    );
}
