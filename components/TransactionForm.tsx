"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TransactionSchema } from "@/lib/schema";
import { addTransaction } from "@/actions/transaction";
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
    PlusCircle, Loader2, X, ShoppingBag, Calendar, ChevronDown, ChevronLeft, ChevronRight,
    TrendingUp, TrendingDown, Sparkles, Utensils, Car, Heart, GraduationCap, Gamepad2,
    Wallet, FolderOpen, Zap, Package, Scissors
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface TransactionFormProps {
    trigger?: React.ReactNode;
}

// ─── Date Picker Component ──────────────────────────────────────
function DatePicker({ value, onChange }: { value: Date; onChange: (date: Date) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date(value));
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    const nextMonth = () => {
        const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
        if (next <= new Date()) setViewDate(next);
    };

    const selectDate = (day: number) => {
        const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        if (selected <= new Date()) {
            onChange(selected);
            setIsOpen(false);
        }
    };

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() && viewDate.getMonth() === today.getMonth() && viewDate.getFullYear() === today.getFullYear();
    };

    const isSelected = (day: number) => {
        return day === value.getDate() && viewDate.getMonth() === value.getMonth() && viewDate.getFullYear() === value.getFullYear();
    };

    const isFuture = (day: number) => {
        const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        return d > new Date();
    };

    const formatDate = (date: Date) => {
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full rounded-xl flex items-center px-4 py-3.5 transition-all duration-300 bg-white/[0.04] backdrop-blur-xl border",
                    isOpen
                        ? "border-teal-500/40 shadow-[0_0_20px_-5px_rgba(45,212,191,0.25)]"
                        : "border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.12]"
                )}
            >
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center mr-3">
                    <Calendar className="w-4 h-4 text-teal-400" />
                </div>
                <span className="text-sm font-medium text-white flex-1 text-left">{formatDate(value)}</span>
                <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-0 right-0 mb-2 z-[60] rounded-xl bg-slate-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/40 p-4"
                    >

                        <div className="flex items-center justify-between mb-4">
                            <button type="button" onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-semibold text-white">
                                {months[viewDate.getMonth()]} {viewDate.getFullYear()}
                            </span>
                            <button
                                type="button"
                                onClick={nextMonth}
                                className={cn(
                                    "p-1.5 rounded-lg transition-colors",
                                    new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1) <= new Date()
                                        ? "hover:bg-white/10 text-slate-400 hover:text-white"
                                        : "text-slate-700 cursor-not-allowed"
                                )}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>


                        <div className="grid grid-cols-7 mb-2">
                            {dayNames.map(d => (
                                <div key={d} className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider py-1">
                                    {d}
                                </div>
                            ))}
                        </div>


                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: firstDay }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const future = isFuture(day);
                                const selected = isSelected(day);
                                const today = isToday(day);

                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => !future && selectDate(day)}
                                        disabled={future}
                                        className={cn(
                                            "relative w-full aspect-square rounded-lg text-xs font-medium transition-all duration-150 flex items-center justify-center",
                                            future && "text-slate-700 cursor-not-allowed",
                                            !future && !selected && "text-slate-300 hover:bg-white/10 hover:text-white",
                                            selected && "bg-teal-500 text-slate-900 font-bold shadow-lg shadow-teal-500/30",
                                            today && !selected && "text-teal-400 font-bold"
                                        )}
                                    >
                                        {day}
                                        {today && !selected && (
                                            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-400" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>


                        <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                            <button
                                type="button"
                                onClick={() => { onChange(new Date()); setIsOpen(false); }}
                                className="flex-1 text-[10px] font-semibold text-teal-400 py-1.5 rounded-lg hover:bg-teal-500/10 transition-colors uppercase tracking-wider"
                            >
                                Today
                            </button>
                            <button
                                type="button"
                                onClick={() => { const y = new Date(); y.setDate(y.getDate() - 1); onChange(y); setIsOpen(false); }}
                                className="flex-1 text-[10px] font-semibold text-slate-400 py-1.5 rounded-lg hover:bg-white/5 transition-colors uppercase tracking-wider"
                            >
                                Yesterday
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Transaction Form ───────────────────────────────────────────
export function TransactionForm({ trigger }: TransactionFormProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const router = useRouter();

    const form = useForm<z.infer<typeof TransactionSchema>>({
        resolver: zodResolver(TransactionSchema),
        defaultValues: {
            amount: 0,
            description: "",
            category: "",
            type: "EXPENSE",
            date: new Date(),
        },
    });

    async function onSubmit(data: z.infer<typeof TransactionSchema>) {
        setLoading(true);
        data.date = selectedDate;
        const result = await addTransaction(data);
        setLoading(false);

        if (result.success) {
            toast.success("Transaction added successfully!");
            setOpen(false);
            form.reset();
            setSelectedDate(new Date());
            setDisplayAmount("");
            router.refresh();
        } else {
            toast.error(result.error as string || "Failed to add transaction");
            console.error(result.error);
        }
    }

    const transactionType = form.watch("type");

    const categories: { name: string; icon: React.ElementType }[] = [
        { name: "Food & Dining", icon: Utensils },
        { name: "Shopping", icon: ShoppingBag },
        { name: "Transportation", icon: Car },
        { name: "Entertainment", icon: Gamepad2 },
        { name: "Medical", icon: Heart },
        { name: "Personal Care", icon: Scissors },
        { name: "Education", icon: GraduationCap },
        { name: "Bills & Utilities", icon: Zap },
        { name: "Investments", icon: TrendingUp },
        { name: "Salary", icon: Wallet },
        { name: "Others", icon: Package },
    ];

    const handleCategorySelect = (category: string) => {
        form.setValue("category", category);
        setIsCategoryOpen(false);
    };

    const [displayAmount, setDisplayAmount] = useState("");

    const formatCurrencyInput = (value: string) => {
        const numberString = value.replace(/\D/g, "");
        return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCurrencyInput(e.target.value);
        setDisplayAmount(formatted);
        const numericValue = Number(formatted.replace(/\./g, ""));
        form.setValue("amount", numericValue);
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setIsCategoryOpen(false); } }}>
            <DialogTrigger asChild>
                {trigger || (
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="glass-button h-10 px-4 rounded-xl flex items-center gap-2 text-white text-sm font-medium hover:text-teal-400 transition-colors"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>Add Transaction</span>
                    </motion.button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg p-0 border-0 text-white overflow-visible bg-transparent shadow-none [&>button]:hidden">
                <DialogTitle className="sr-only">Add New Transaction</DialogTitle>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    className="relative rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/40 overflow-visible"
                >

                    <div className={cn(
                        "absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full blur-3xl opacity-30 pointer-events-none transition-colors duration-500",
                        transactionType === "INCOME" ? "bg-teal-500" : "bg-rose-500"
                    )} />

                    <div className="relative z-10 p-8">

                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles className="w-4 h-4 text-teal-400" />
                                    <h2 className="text-xl font-bold text-white tracking-tight">New Transaction</h2>
                                </div>
                                <DialogDescription className="text-sm text-slate-500">
                                    Record a new income or expense.
                                </DialogDescription>
                            </div>
                            <DialogClose className="text-slate-500 hover:text-white transition-colors rounded-xl p-2 hover:bg-white/10 outline-none">
                                <X className="w-5 h-5" />
                            </DialogClose>
                        </div>

                        <form onSubmit={form.handleSubmit(onSubmit)}>

                            <div className="flex gap-3 mb-6">
                                <label className="flex-1 cursor-pointer group">
                                    <input type="radio" value="EXPENSE" {...form.register("type")} className="peer sr-only" />
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={cn(
                                            "rounded-xl p-3 text-center transition-all duration-300 border flex items-center justify-center gap-2",
                                            "bg-white/[0.03] border-white/[0.06] text-slate-500",
                                            "peer-checked:bg-rose-500/15 peer-checked:border-rose-500/40 peer-checked:text-rose-400 peer-checked:shadow-[0_0_25px_-5px_rgba(244,63,94,0.3)]"
                                        )}
                                    >
                                        <TrendingDown className="w-4 h-4" />
                                        <span className="text-sm font-bold">Expense</span>
                                    </motion.div>
                                </label>
                                <label className="flex-1 cursor-pointer group">
                                    <input type="radio" value="INCOME" {...form.register("type")} className="peer sr-only" />
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={cn(
                                            "rounded-xl p-3 text-center transition-all duration-300 border flex items-center justify-center gap-2",
                                            "bg-white/[0.03] border-white/[0.06] text-slate-500",
                                            "peer-checked:bg-teal-500/15 peer-checked:border-teal-500/40 peer-checked:text-teal-400 peer-checked:shadow-[0_0_25px_-5px_rgba(45,212,191,0.3)]"
                                        )}
                                    >
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-sm font-bold">Income</span>
                                    </motion.div>
                                </label>
                            </div>


                            <div className="mb-6 text-center">
                                <label className={cn(
                                    "block text-[10px] uppercase tracking-widest font-bold mb-3 transition-colors",
                                    transactionType === "INCOME" ? "text-teal-500" : "text-rose-500"
                                )}>
                                    Amount
                                </label>
                                <div className="relative">
                                    <span className={cn(
                                        "absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-light transition-colors",
                                        transactionType === "INCOME" ? "text-teal-500/40" : "text-rose-500/40"
                                    )}>Rp</span>
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="0"
                                        value={displayAmount}
                                        onChange={handleAmountChange}
                                        className={cn(
                                            "w-full bg-white/[0.03] backdrop-blur-xl border rounded-xl text-center text-2xl sm:text-4xl font-bold placeholder-slate-700 outline-none px-8 sm:px-12 py-4 transition-all duration-300",
                                            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                                            transactionType === "INCOME"
                                                ? "border-white/[0.06] focus:border-teal-500/40 text-teal-400 focus:shadow-[0_0_30px_-8px_rgba(45,212,191,0.2)]"
                                                : "border-white/[0.06] focus:border-rose-500/40 text-rose-400 focus:shadow-[0_0_30px_-8px_rgba(244,63,94,0.2)]"
                                        )}
                                    />
                                </div>
                                {form.formState.errors.amount && <p className="text-red-400 text-xs mt-2">{form.formState.errors.amount.message}</p>}
                            </div>


                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

                                <div className="col-span-1 relative z-50">
                                    <label className="block text-[10px] font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Category</label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                            className={cn(
                                                "w-full rounded-xl flex items-center px-3 py-3 transition-all duration-300 bg-white/[0.04] backdrop-blur-xl border",
                                                isCategoryOpen
                                                    ? "border-teal-500/40 shadow-[0_0_20px_-5px_rgba(45,212,191,0.2)]"
                                                    : "border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.12]"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center mr-3 shrink-0 transition-colors",
                                                transactionType === "INCOME" ? "bg-teal-500/10" : "bg-rose-500/10"
                                            )}>
                                                {(() => {
                                                    const CatIcon = categories.find(c => c.name === form.watch("category"))?.icon || FolderOpen;
                                                    return <CatIcon className={cn("w-4 h-4", transactionType === "INCOME" ? "text-teal-400" : "text-rose-400")} />;
                                                })()}
                                            </div>
                                            <span className={cn("text-sm font-medium flex-1 truncate text-left", form.watch("category") ? "text-white" : "text-slate-500")}>
                                                {form.watch("category") || "Select"}
                                            </span>
                                            <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform duration-200", isCategoryOpen && "rotate-180")} />
                                        </button>

                                        <AnimatePresence>
                                            {isCategoryOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden"
                                                >
                                                    <div className="max-h-48 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
                                                        {categories.map((cat) => (
                                                            <button
                                                                key={cat.name}
                                                                type="button"
                                                                onClick={() => handleCategorySelect(cat.name)}
                                                                className={cn(
                                                                    "w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors",
                                                                    form.watch("category") === cat.name
                                                                        ? "bg-teal-500/10 text-teal-400"
                                                                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                                                                )}
                                                            >
                                                                <cat.icon className={cn(
                                                                    "w-4 h-4 shrink-0",
                                                                    form.watch("category") === cat.name ? "text-teal-400" : "text-slate-400"
                                                                )} />
                                                                {cat.name}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <div className="relative border-t border-white/5 px-3 py-1.5 flex items-center justify-center gap-1.5 bg-slate-900/80">
                                                        <ChevronDown className="w-3 h-3 text-slate-500 animate-bounce" />
                                                        <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Scroll for more</span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <input type="hidden" {...form.register("category")} />
                                    {form.formState.errors.category && <p className="text-red-400 text-xs mt-1 ml-1">{form.formState.errors.category.message}</p>}
                                </div>


                                <div className="col-span-1">
                                    <label className="block text-[10px] font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Date</label>
                                    <DatePicker value={selectedDate} onChange={setSelectedDate} />
                                </div>
                            </div>


                            <div className="mb-8">
                                <label className="block text-[10px] font-bold text-slate-500 mb-2 ml-1 uppercase tracking-widest">Notes (Optional)</label>
                                <div className="rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] p-3 transition-all duration-300 focus-within:border-teal-500/30 focus-within:shadow-[0_0_20px_-8px_rgba(45,212,191,0.15)] hover:bg-white/[0.06]">
                                    <textarea
                                        {...form.register("description")}
                                        className="w-full bg-transparent border-none text-sm text-white placeholder-slate-600 focus:ring-0 resize-none p-0 outline-none min-h-[50px]"
                                        placeholder="Grocery shopping, lunch, etc..."
                                        rows={2}
                                    />
                                </div>
                            </div>


                            <div className="flex items-center gap-3">
                                <DialogClose asChild>
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 px-6 py-3.5 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] text-slate-400 font-semibold text-sm hover:bg-white/[0.08] hover:text-white transition-all duration-200"
                                    >
                                        Cancel
                                    </motion.button>
                                </DialogClose>
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02, y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={cn(
                                        "flex-[2] px-6 py-3.5 rounded-xl font-bold text-sm flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300",
                                        transactionType === "INCOME"
                                            ? "bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-900 shadow-lg shadow-teal-500/25"
                                            : "bg-gradient-to-r from-rose-500 to-pink-400 text-white shadow-lg shadow-rose-500/25"
                                    )}
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            <PlusCircle className="w-5 h-5" />
                                            Add Transaction
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
