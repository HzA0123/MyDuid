"use client";

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { LayoutDashboard, CreditCard, Target, LogOut, User, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { LogoutDialog } from "@/components/LogoutDialog";

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export function MobileSidebar({ isOpen, onClose, user }: MobileSidebarProps) {
    const pathname = usePathname();
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [logoutHovered, setLogoutHovered] = useState(false);

    return (
        <AnimatePresence>
            {isOpen && (
                <>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />


                    <motion.aside
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-0 left-0 bottom-0 w-72 glass-panel z-50 md:hidden flex flex-col border-r border-white/10"
                    >
                        <div className="h-24 flex items-center justify-between px-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    whileHover={{ scale: 1.08, rotate: [0, -5, 5, 0] }}
                                    transition={{ rotate: { duration: 0.4 } }}
                                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.3)] shrink-0 relative"
                                >
                                    <CreditCard className="w-5 h-5 text-white" />
                                    <motion.div
                                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="absolute inset-0 rounded-xl bg-teal-400/20 blur-md -z-10"
                                    />
                                </motion.div>
                                <span className="text-xl font-bold tracking-tight text-white">MyDuid</span>
                            </div>
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>

                        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                            <LayoutGroup>
                                <NavLink
                                    href="/dashboard"
                                    icon={LayoutDashboard}
                                    label="Overview"
                                    active={pathname === "/dashboard"}
                                    onClick={onClose}
                                />
                                <NavLink
                                    href="/dashboard/transactions"
                                    icon={CreditCard}
                                    label="Transactions"
                                    active={pathname === "/dashboard/transactions"}
                                    onClick={onClose}
                                />
                                <NavLink
                                    href="/dashboard/goals"
                                    icon={Target}
                                    label="Goals"
                                    active={pathname === "/dashboard/goals"}
                                    onClick={onClose}
                                />
                            </LayoutGroup>
                        </nav>

                        <div className="p-4 border-t border-white/10 bg-black/10">
                            <div className="flex items-center gap-3 mb-4 px-2">
                                {user.image ? (
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className="w-10 h-10 rounded-full p-[1px] bg-gradient-to-tr from-teal-400 to-emerald-400 shrink-0 relative"
                                    >
                                        <Image
                                            src={user.image}
                                            alt="User"
                                            width={40}
                                            height={40}
                                            className="rounded-full w-full h-full object-cover border-2 border-slate-900"
                                        />
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-[0_0_6px_rgba(16,185,129,0.6)]"
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shrink-0 relative"
                                    >
                                        <User className="w-5 h-5 text-slate-300" />
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-[0_0_6px_rgba(16,185,129,0.6)]"
                                        />
                                    </motion.div>
                                )}

                                <div className="flex-1 min-w-0 overflow-hidden">
                                    <p className="text-sm font-semibold text-white truncate">{user.name || "User"}</p>
                                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                </div>
                            </div>

                            <motion.button
                                onClick={() => setLogoutOpen(true)}
                                onHoverStart={() => setLogoutHovered(true)}
                                onHoverEnd={() => setLogoutHovered(false)}
                                whileHover={{ x: 2 }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-3 w-full px-4 py-3 text-xs font-medium text-gray-500 hover:text-red-400 transition-colors rounded-xl hover:bg-red-500/[0.06] relative overflow-hidden"
                            >
                                <motion.div
                                    animate={{ rotate: logoutHovered ? 12 : 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                >
                                    <LogOut className="w-4 h-4 shrink-0" />
                                </motion.div>
                                <span>Sign Out</span>
                            </motion.button>
                            <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
