"use client";

import { useEffect, useRef, useState } from "react";
import { Wallet, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react";
import { motion, useInView, animate } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsData {
    balance: { value: number; change: number };
    income: { value: number; change: number };
    expense: { value: number; change: number };
}

// ─── Animated Counter ───────────────────────────────────────────
function AnimatedNumber({ value, duration = 1.2 }: { value: number; duration?: number }) {
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (!isInView) return;

        const controls = animate(0, value, {
            duration,
            ease: [0.25, 0.46, 0.45, 0.94],
            onUpdate: (latest) => setDisplayValue(Math.round(latest)),
        });

        return () => controls.stop();
    }, [value, isInView, duration]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return <span ref={ref}>{formatCurrency(displayValue)}</span>;
}

// ─── Animated Percentage ────────────────────────────────────────
function AnimatedPercentage({ value, duration = 1.5 }: { value: number; duration?: number }) {
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (!isInView) return;

        const controls = animate(0, Math.abs(value), {
            duration,
            ease: [0.25, 0.46, 0.45, 0.94],
            onUpdate: (latest) => setDisplayValue(latest),
        });

        return () => controls.stop();
    }, [value, isInView, duration]);

    return <span ref={ref}>{displayValue.toFixed(1)}%</span>;
}

// ─── Stat Card ──────────────────────────────────────────────────
interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: number;
    change: number;
    accentColor: "teal" | "blue" | "rose";
    invertChange?: boolean;
    delay: number;
}

const accentColors = {
    teal: {
        iconBg: "bg-teal-500/10",
        iconText: "text-teal-400",
        hoverBorder: "hover:border-teal-500/30",
        glow: "rgba(20, 184, 166, 0.12)",
        glowStrong: "rgba(20, 184, 166, 0.25)",
        gradient: "from-teal-500/20 via-transparent to-transparent",
        ringColor: "ring-teal-500/20",
        sparkle: "bg-teal-400",
    },
    blue: {
        iconBg: "bg-blue-500/10",
        iconText: "text-blue-400",
        hoverBorder: "hover:border-blue-500/30",
        glow: "rgba(59, 130, 246, 0.12)",
        glowStrong: "rgba(59, 130, 246, 0.25)",
        gradient: "from-blue-500/20 via-transparent to-transparent",
        ringColor: "ring-blue-500/20",
        sparkle: "bg-blue-400",
    },
    rose: {
        iconBg: "bg-rose-500/10",
        iconText: "text-rose-400",
        hoverBorder: "hover:border-rose-500/30",
        glow: "rgba(244, 63, 94, 0.12)",
        glowStrong: "rgba(244, 63, 94, 0.25)",
        gradient: "from-rose-500/20 via-transparent to-transparent",
        ringColor: "ring-rose-500/20",
        sparkle: "bg-rose-400",
    },
};

function StatCard({ icon: Icon, label, value, change, accentColor, invertChange, delay }: StatCardProps) {
    const colors = accentColors[accentColor];
    const isPositive = invertChange ? change <= 0 : change >= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.5,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl transition-all duration-500",
                colors.hoverBorder
            )}
        >
            {/* Ambient glow on hover */}
            <div
                className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none"
                style={{ background: colors.glowStrong }}
            />

            {/* Subtle top edge gradient */}
            <div className={cn("absolute top-0 left-0 right-0 h-px bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500", colors.gradient)} />

            {/* Content */}
            <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-4">
                    {/* Icon */}
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className={cn("rounded-xl p-2.5", colors.iconBg)}
                    >
                        <Icon className={cn("w-5 h-5", colors.iconText)} />
                    </motion.div>

                    {/* Change indicator */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: delay + 0.3 }}
                        className={cn(
                            "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg",
                            isPositive
                                ? "text-emerald-400 bg-emerald-500/10"
                                : "text-rose-400 bg-rose-500/10"
                        )}
                    >
                        {isPositive ? (
                            <TrendingUp className="w-3 h-3" />
                        ) : (
                            <TrendingDown className="w-3 h-3" />
                        )}
                        <AnimatedPercentage value={change} duration={1.8} />
                    </motion.div>
                </div>

                {/* Label */}
                <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: delay + 0.1 }}
                    className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2"
                >
                    {label}
                </motion.h3>

                {/* Value */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: delay + 0.15 }}
                    className="text-2xl font-bold tracking-tight text-white"
                >
                    <AnimatedNumber value={value} duration={1.5} />
                </motion.div>

                {/* Sparkle bar */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: delay + 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={cn("mt-4 h-[2px] rounded-full origin-left opacity-30", colors.sparkle)}
                />
            </div>
        </motion.div>
    );
}

// ─── Dashboard Stats ────────────────────────────────────────────
export function DashboardStats({ stats }: { stats: StatsData }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
                icon={Wallet}
                label="Total Balance"
                value={stats.balance.value}
                change={stats.balance.change}
                accentColor="teal"
                delay={0}
            />
            <StatCard
                icon={ArrowUpRight}
                label="Total Income"
                value={stats.income.value}
                change={stats.income.change}
                accentColor="blue"
                delay={0.1}
            />
            <StatCard
                icon={ArrowDownRight}
                label="Total Expense"
                value={stats.expense.value}
                change={stats.expense.change}
                accentColor="rose"
                invertChange={true}
                delay={0.2}
            />
        </div>
    );
}
