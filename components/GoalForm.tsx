"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createGoal } from "@/actions/goal";
import { Plus, ChevronUp, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export function GoalForm() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [targetAmount, setTargetAmount] = useState("");
    const router = useRouter();

    const formatCurrencyInput = (value: string) => {
        const numberString = value.replace(/\D/g, "");
        return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const parseCurrencyInput = (value: string) => {
        return Number(value.replace(/\./g, ""));
    };

    const handleIncrement = () => {
        const current = parseCurrencyInput(targetAmount);
        setTargetAmount(formatCurrencyInput(String(current + 100000)));
    };

    const handleDecrement = () => {
        const current = parseCurrencyInput(targetAmount);
        if (current > 0) {
            setTargetAmount(formatCurrencyInput(String(Math.max(0, current - 100000))));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTargetAmount(formatCurrencyInput(e.target.value));
    };


    async function handleSubmit(formData: FormData) {
        setLoading(true);

        const rawAmount = parseCurrencyInput(targetAmount);
        formData.set("targetAmount", String(rawAmount));

        const result = await createGoal(formData);

        if (result?.success) {
            toast.success("Goal created successfully!");
            setOpen(false);
            setTargetAmount("");
            router.refresh();
        } else {
            let errorMessage = "Failed to create goal";
            if (typeof result?.error === "string") {
                errorMessage = result.error;
            } else if (typeof result?.error === "object") {

                const firstError = Object.values(result.error)[0];
                if (Array.isArray(firstError)) {
                    errorMessage = firstError[0];
                }
            }
            toast.error(errorMessage);
            console.error(result?.error);
        }
        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-4 py-2 flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(20,184,166,0.5)]">
                    <Plus className="w-4 h-4" />
                    <span>Add Goal</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="glass-panel border border-white/10 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Saving Goal</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-300">Goal Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="e.g. New MacBook Pro"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all placeholder:text-gray-600"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="targetAmount" className="text-sm font-medium text-gray-300">Target Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">Rp</span>
                            <input
                                type="text"
                                id="targetAmount"
                                name="targetAmount"
                                value={targetAmount}
                                onChange={handleChange}
                                placeholder="1.000.000"
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

                    <div className="space-y-2">
                        <label htmlFor="deadline" className="text-sm font-medium text-gray-300">Deadline (Optional)</label>
                        <input
                            type="date"
                            id="deadline"
                            name="deadline"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all [color-scheme:dark]"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white" disabled={loading}>
                            {loading ? "Creating..." : "Create Goal"}
                        </Button>
                    </div>
                </form >
            </DialogContent >
        </Dialog >
    );
}
