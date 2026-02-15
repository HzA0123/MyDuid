"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateGoalAmount } from "@/actions/goal";
import { ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";



interface DepositModalProps {
    goalId: string;
    goalName: string;
    trigger?: React.ReactNode;
}

export function DepositModal({ goalId, goalName, trigger }: DepositModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState("");
    const router = useRouter();

    const formatCurrencyInput = (value: string) => {
        const numberString = value.replace(/\D/g, "");
        return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const parseCurrencyInput = (value: string) => {
        return Number(value.replace(/\./g, ""));
    };

    const handleIncrement = () => {
        const current = parseCurrencyInput(amount);
        setAmount(formatCurrencyInput(String(current + 10000)));
    };

    const handleDecrement = () => {
        const current = parseCurrencyInput(amount);
        if (current > 0) {
            setAmount(formatCurrencyInput(String(Math.max(0, current - 10000))));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(formatCurrencyInput(e.target.value));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const value = parseCurrencyInput(amount);
        if (value > 0) {
            const result = await updateGoalAmount(goalId, value);
            if (result && 'success' in result && result.success) {
                toast.success(`Successfully deposited ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value)}`);
                setOpen(false);
                setAmount("");
                router.refresh();
            } else if (result && 'error' in result) {
                toast.error(result.error);
            }
        }

        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="border-teal-500/20 text-teal-400 hover:bg-teal-500/10 hover:text-teal-300">
                        Custom Deposit
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="glass-panel border border-white/10 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Deposit into {goalName}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <label htmlFor="amount" className="text-sm font-medium text-gray-300">Amount to Deposit</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">Rp</span>
                            <input
                                type="text"
                                id="amount"
                                value={amount}
                                onChange={handleChange}
                                placeholder="0"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <div className="absolute right-1 top-1 bottom-1 flex flex-col w-8 border-l border-white/10">
                                <button
                                    type="button"
                                    onClick={handleIncrement}
                                    className="flex-1 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-teal-400 rounded-tr-md transition-colors"
                                >
                                    <ChevronUp className="w-3 h-3" />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDecrement}
                                    className="flex-1 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-rose-400 rounded-br-md transition-colors"
                                >
                                    <ChevronDown className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white" disabled={loading || !amount}>
                            {loading ? "Processing..." : "Deposit"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
