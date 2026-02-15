"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, AlertTriangle, X } from "lucide-react";

interface LogoutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await signOut({ callbackUrl: "/login" });
    };

    return (
        <AnimatePresence>
            {open && (
                <>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => onOpenChange(false)}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                    />


                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-sm"
                    >
                        <div className="relative rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-6 shadow-2xl shadow-black/40 overflow-hidden">

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.6, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                                className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full pointer-events-none"
                                style={{
                                    background: "radial-gradient(circle, rgba(239, 68, 68, 0.3), transparent 70%)",
                                }}
                            />


                            <button
                                onClick={() => onOpenChange(false)}
                                className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>


                            <div className="relative z-10 flex flex-col items-center text-center">

                                <motion.div
                                    initial={{ scale: 0, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                                    className="relative mb-5"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                        <motion.div
                                            animate={{ y: [0, -3, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                                        >
                                            <AlertTriangle className="w-8 h-8 text-red-400" />
                                        </motion.div>
                                    </div>

                                    <motion.div
                                        initial={{ scale: 1, opacity: 0.5 }}
                                        animate={{ scale: 1.5, opacity: 0 }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="absolute inset-0 rounded-2xl border-2 border-red-500/30"
                                    />
                                </motion.div>

                                <motion.h3
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="text-lg font-bold text-white mb-2"
                                >
                                    Sign Out?
                                </motion.h3>

                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-sm text-slate-400 mb-8 leading-relaxed max-w-[260px]"
                                >
                                    You will be signed out of your current session. Make sure all your changes are saved.
                                </motion.p>


                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className="flex items-center gap-3 w-full"
                                >
                                    <button
                                        onClick={() => onOpenChange(false)}
                                        className="flex-1 px-4 py-3 rounded-xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] text-sm font-semibold text-slate-300 hover:bg-white/[0.1] hover:border-white/[0.15] transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        disabled={loading}
                                        className="flex-1 px-4 py-3 rounded-xl bg-red-500/90 text-sm font-bold text-white hover:bg-red-500 transition-all duration-200 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                            />
                                        ) : (
                                            <>
                                                <LogOut className="w-4 h-4" />
                                                Yes, Sign Out
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
