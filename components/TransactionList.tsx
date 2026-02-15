"use client";

import { deleteTransaction } from "@/actions/transaction";
import { format } from "date-fns";
import {
    Trash2, ChevronLeft, ChevronRight, ReceiptText,
    Utensils, Car, ShoppingBag, Heart, GraduationCap, Gamepad2, FileText,
    Wallet, Laptop, TrendingUp, Gift, FolderOpen
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Transaction = {
    id: string;
    amount: number;
    description: string;
    date: Date;
    category: string;
    type: string;
}

const categoryIconMap: Record<string, React.ElementType> = {
    "Food": Utensils,
    "Transport": Car,
    "Shopping": ShoppingBag,
    "Health": Heart,
    "Education": GraduationCap,
    "Entertainment": Gamepad2,
    "Bills": FileText,
    "Salary": Wallet,
    "Freelance": Laptop,
    "Investment": TrendingUp,
    "Gift": Gift,
    "Other": FolderOpen,

    "Makanan": Utensils,
    "Transportasi": Car,
    "Belanja": ShoppingBag,
    "Kesehatan": Heart,
    "Pendidikan": GraduationCap,
    "Hiburan": Gamepad2,
    "Tagihan": FileText,
    "Gaji": Wallet,
    "Investasi": TrendingUp,
    "Hadiah": Gift,
    "Lainnya": FolderOpen,
};

export function TransactionList({ transactions, compact = false }: { transactions: Transaction[], compact?: boolean }) {
    const [optimisticTransactions, setTransactions] = useState(transactions);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        setTransactions(transactions);
    }, [transactions]);

    const totalPages = Math.ceil(optimisticTransactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTransactions = optimisticTransactions.slice(startIndex, endIndex);

    async function handleDelete(id: string) {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        const result = await deleteTransaction(id);
        if (!result.success) {
            setTransactions(transactions);
            toast.error("Failed to delete transaction.");
        } else {
            toast.success("Transaction deleted.");
        }
    }

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const getCategoryIcon = (category: string) => categoryIconMap[category] || FolderOpen;

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(amount));

    // ─── Empty State ────────────────────────────────────────
    if (optimisticTransactions.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center"
            >
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
                    <ReceiptText className="w-7 h-7 text-slate-600" />
                </div>
                <p className="text-slate-500 font-medium text-sm">No transactions yet</p>
                <p className="text-slate-600 text-xs mt-1">Your activity will appear here.</p>
            </motion.div>
        );
    }

    // ─── Compact Mode (Dashboard sidebar) ───────────────────
    if (compact) {
        return (
            <div className="space-y-2">
                {currentTransactions.map((transaction, index) => {
                    const Icon = getCategoryIcon(transaction.category);
                    return (
                        <motion.div
                            key={transaction.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.04, duration: 0.3 }}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-all group"
                        >
                            <div className={cn(
                                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                                transaction.type === "INCOME" ? "bg-emerald-500/10" : "bg-rose-500/10"
                            )}>
                                <Icon className={cn("w-4 h-4", transaction.type === "INCOME" ? "text-emerald-400" : "text-rose-400")} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-200 truncate">{transaction.description}</p>
                                <p className="text-[11px] text-slate-500">{format(new Date(transaction.date), "dd MMM")}</p>
                            </div>
                            <span className={cn(
                                "text-sm font-bold whitespace-nowrap",
                                transaction.type === "INCOME" ? "text-emerald-400" : "text-rose-400"
                            )}>
                                {transaction.type === "INCOME" ? "+" : "-"}{formatCurrency(transaction.amount)}
                            </span>
                        </motion.div>
                    );
                })}
            </div>
        );
    }

    // ─── Full Mode (Transaction Page) ───────────────────────
    return (
        <div className="space-y-3">

            <div className="hidden sm:flex items-center px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                <div className="flex-[3] min-w-0">Description</div>
                <div className="w-28 shrink-0 hidden sm:block text-left">Date</div>
                <div className="w-28 shrink-0 hidden md:block text-left">Category</div>
                <div className="w-36 shrink-0 text-right pr-9">Amount</div>
            </div>


            <div className="space-y-1.5">
                <AnimatePresence mode="popLayout">
                    {currentTransactions.map((transaction, index) => {
                        const Icon = getCategoryIcon(transaction.category);
                        return (
                            <motion.div
                                key={transaction.id}
                                layout
                                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -40, scale: 0.95 }}
                                transition={{
                                    delay: index * 0.03,
                                    duration: 0.3,
                                    layout: { type: "spring", stiffness: 350, damping: 35 },
                                }}
                                className={cn(
                                    "group rounded-xl border border-transparent transition-all duration-300",
                                    "hover:bg-white/[0.04] hover:border-white/[0.06]",
                                    "hover:shadow-[0_4px_24px_-8px_rgba(0,0,0,0.3)]",
                                    /* Mobile: simple flex row | Desktop: table-style */
                                    "flex items-center px-4 sm:px-5 py-3 sm:py-3.5"
                                )}
                            >

                                <div className={cn(
                                    "w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 mr-3",
                                    transaction.type === "INCOME"
                                        ? "bg-emerald-500/10 group-hover:bg-emerald-500/15 group-hover:shadow-[0_0_12px_-4px_rgba(16,185,129,0.3)]"
                                        : "bg-rose-500/10 group-hover:bg-rose-500/15 group-hover:shadow-[0_0_12px_-4px_rgba(244,63,94,0.3)]"
                                )}>
                                    <Icon className={cn(
                                        "w-4 h-4 transition-colors",
                                        transaction.type === "INCOME" ? "text-emerald-400" : "text-rose-400"
                                    )} />
                                </div>


                                <div className="flex-1 min-w-0 sm:flex-[3]">
                                    <p className="font-semibold text-slate-200 truncate text-sm group-hover:text-white transition-colors">
                                        {transaction.description}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-[11px] text-slate-500 truncate">{transaction.category}</span>
                                        <span className="sm:hidden text-[11px] text-slate-600 shrink-0">• {format(new Date(transaction.date), "dd MMM")}</span>
                                    </div>
                                </div>


                                <div className="w-28 shrink-0 hidden sm:block">
                                    <span className="text-sm text-slate-400">{format(new Date(transaction.date), "dd MMM yyyy")}</span>
                                </div>


                                <div className="w-28 shrink-0 hidden md:block">
                                    <span className={cn(
                                        "text-xs font-medium px-2.5 py-1 rounded-lg inline-block",
                                        transaction.type === "INCOME"
                                            ? "bg-emerald-500/10 text-emerald-400/80"
                                            : "bg-rose-500/10 text-rose-400/80"
                                    )}>
                                        {transaction.category}
                                    </span>
                                </div>


                                <div className="shrink-0 ml-3 sm:ml-0 sm:w-36 flex items-center justify-end gap-2">
                                    <span className={cn(
                                        "font-bold text-xs sm:text-sm whitespace-nowrap tracking-tight",
                                        transaction.type === "INCOME" ? "text-emerald-400" : "text-rose-400"
                                    )}>
                                        {transaction.type === "INCOME" ? "+" : "-"}{formatCurrency(transaction.amount)}
                                    </span>

                                    <motion.button
                                        whileHover={{ scale: 1.15 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDelete(transaction.id)}
                                        className="w-7 p-1.5 rounded-lg text-slate-600 opacity-0 group-hover:opacity-100 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 shrink-0 hidden sm:block"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* ─── Pagination ──────────────────────────────────── */}
            {totalPages > 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-between pt-6 border-t border-white/[0.05]"
                >
                    <span className="text-xs text-slate-500">
                        Page <span className="text-white font-semibold">{currentPage}</span> of <span className="text-white font-semibold">{totalPages}</span>
                        <span className="hidden sm:inline ml-2 text-slate-600">• {optimisticTransactions.length} total</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-20 transition-all border border-transparent hover:border-white/[0.06]"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </motion.button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <motion.button
                                    key={page}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handlePageChange(page)}
                                    className={cn(
                                        "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-200",
                                        currentPage === page
                                            ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                                            : "text-slate-500 hover:text-white hover:bg-white/[0.06]"
                                    )}
                                >
                                    {page}
                                </motion.button>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-20 transition-all border border-transparent hover:border-white/[0.06]"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
