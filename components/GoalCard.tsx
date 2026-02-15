"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Trophy, Target, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";
import { DepositModal } from "@/components/DepositModal";
import { updateGoalAmount, deleteGoal } from "@/actions/goal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface GoalCardProps {
    goal: {
        id: string;
        name: string;
        targetAmount: number;
        currentAmount: number;
        deadline?: Date | null;
    };
    compact?: boolean;
    hideWrapper?: boolean;
}

export function GoalCard({ goal, compact = false, hideWrapper = false }: GoalCardProps) {
    const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const isComplete = percentage >= 100;
    const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleQuickDeposit = async () => {
        setLoading(true);
        const result = await updateGoalAmount(goal.id, 100000);
        if (result && 'error' in result) {
            toast.error(result.error);
        } else {
            toast.success("Added Rp100.000 to goal!");
            router.refresh();
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this goal?")) {
            setLoading(true);
            await deleteGoal(goal.id);
            router.refresh();
            setLoading(false);
        }
    }

    const Content = (
        <div className="relative">
            {isComplete && (
                <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-48 h-20 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"
                />
            )}
            {!isComplete && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-48 h-20 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            )}

            <div className={cn(
                "flex items-center gap-6 relative z-10",
                compact ? "flex-col sm:flex-row lg:flex-col" : "flex-col md:flex-row"
            )}>
                <div className="shrink-0 relative">
                    <CircularProgress
                        value={percentage}
                        size={compact ? 100 : 140}
                        strokeWidth={compact ? 8 : 12}
                    />
                    {isComplete && (
                        <motion.div
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30"
                        >
                            <Sparkles className="w-4 h-4 text-white" />
                        </motion.div>
                    )}
                </div>

                <div className={cn(
                    "flex-1 w-full text-center",
                    compact ? "md:text-left lg:text-center" : "md:text-left"
                )}>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                        <h3 className={cn(
                            "font-bold text-white",
                            compact ? "text-lg" : "text-xl"
                        )}>
                            {goal.name}
                        </h3>
                        {isComplete && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/20 text-[10px] font-bold text-amber-400 uppercase tracking-wider"
                            >
                                Done!
                            </motion.span>
                        )}
                    </div>

                    {goal.deadline && (
                        <p className="text-xs text-slate-500 mb-4 flex items-center gap-1.5 justify-center md:justify-start">
                            <TrendingUp className="w-3 h-3" />
                            Expected by {new Date(goal.deadline).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </p>
                    )}

                    <div className="grid grid-cols-2 gap-3 mb-5">
                        <motion.div
                            whileHover={{ scale: 1.02, y: -1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 backdrop-blur-sm transition-all duration-500 hover:border-emerald-500/25 hover:bg-emerald-500/[0.03]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="rounded-lg bg-emerald-500/10 p-1.5 text-emerald-400">
                                        <Trophy className="w-3 h-3" />
                                    </span>
                                    <h3 className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.15em]">Saved</h3>
                                </div>
                                <span className={cn(
                                    "font-bold tracking-tight text-white block truncate",
                                    compact ? "text-sm" : "text-base"
                                )}>
                                    {formatCurrency(goal.currentAmount)}
                                </span>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02, y: -1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 backdrop-blur-sm transition-all duration-500 hover:border-blue-500/25 hover:bg-blue-500/[0.03]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="rounded-lg bg-blue-500/10 p-1.5 text-blue-400">
                                        <Target className="w-3 h-3" />
                                    </span>
                                    <h3 className="text-[9px] font-bold text-blue-500/60 uppercase tracking-[0.15em]">Target</h3>
                                </div>
                                <span className={cn(
                                    "font-bold tracking-tight text-white block truncate",
                                    compact ? "text-sm" : "text-base"
                                )}>
                                    {formatCurrency(goal.targetAmount)}
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-[11px]">
                            <span className="text-slate-500 font-medium">Remaining</span>
                            <span className={cn(
                                "font-semibold",
                                isComplete ? "text-amber-400" : "text-slate-300"
                            )}>
                                {isComplete ? "Goal reached! 🎉" : formatCurrency(remaining)}
                            </span>
                        </div>
                        <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden relative">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                                className={cn(
                                    "h-full rounded-full relative",
                                    isComplete
                                        ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500"
                                        : "bg-gradient-to-r from-teal-500 to-emerald-400"
                                )}
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.15)_50%,transparent_75%)] bg-[length:200%_100%] animate-shimmer rounded-full" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cn(
                "mt-6 flex gap-2 relative z-10",
                compact ? "flex-col" : ""
            )}>
                <div className="flex gap-2 w-full">
                    <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            onClick={handleQuickDeposit}
                            disabled={loading || isComplete}
                            size={compact ? "sm" : "default"}
                            className={cn(
                                "w-full text-xs font-semibold transition-all duration-300",
                                isComplete
                                    ? "bg-amber-500/10 text-amber-400/50 border border-amber-500/10 cursor-not-allowed"
                                    : "bg-teal-500/15 hover:bg-teal-500/25 text-teal-400 border border-teal-500/20 hover:border-teal-500/40 hover:shadow-[0_0_20px_-5px_rgba(45,212,191,0.3)]"
                            )}
                        >
                            <Plus className="w-3.5 h-3.5 mr-1.5" />
                            Quick +100k
                        </Button>
                    </motion.div>

                    <DepositModal
                        goalId={goal.id}
                        goalName={goal.name}
                        trigger={
                            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    variant="outline"
                                    size={compact ? "sm" : "default"}
                                    disabled={isComplete}
                                    className={cn(
                                        "w-full text-xs font-semibold bg-transparent transition-all duration-300",
                                        isComplete
                                            ? "border-amber-500/10 text-amber-400/50 cursor-not-allowed"
                                            : "border-white/[0.08] text-slate-300 hover:bg-teal-500/10 hover:text-teal-300 hover:border-teal-500/30"
                                    )}
                                >
                                    Custom
                                </Button>
                            </motion.div>
                        }
                    />
                </div>

                {!compact && (
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                            variant="ghost"
                            className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 shrink-0 transition-all duration-300"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </motion.div>
                )}
                {compact && (
                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full h-8 text-xs text-slate-500 bg-white/[0.02] hover:bg-rose-500/10 hover:text-rose-400 border border-transparent hover:border-rose-500/20 transition-all duration-300 mt-1"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            <Trash2 className="w-3 h-3 mr-1.5" />
                            Delete Goal
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );

    if (hideWrapper) {
        return (
            <div className="relative overflow-visible group p-0">
                {Content}
            </div>
        );
    }

    return (
        <GlassCard className="relative overflow-visible group">
            {Content}
        </GlassCard>
    );
}
