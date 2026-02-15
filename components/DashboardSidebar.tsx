"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, CreditCard, User, LogOut, ChevronLeft, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";
import { LogoutDialog } from "@/components/LogoutDialog";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

interface DashboardSidebarProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [logoutHovered, setLogoutHovered] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <motion.aside
            animate={{ width: isCollapsed ? 80 : 288 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="hidden md:flex flex-col h-full glass-panel relative z-20"
        >

            <div className={cn("h-24 flex items-center px-4 border-b border-white/10 relative", isCollapsed ? "justify-center" : "justify-start px-8")}>
                <motion.div
                    whileHover={{ scale: 1.08, rotate: [0, -5, 5, 0] }}
                    transition={{ rotate: { duration: 0.4 } }}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.3)] shrink-0 cursor-pointer relative"
                >
                    <CreditCard className="w-5 h-5 text-white" />

                    <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "loop" }}
                        className="absolute inset-0 rounded-xl bg-teal-400/20 blur-md -z-10"
                    />
                </motion.div>

                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="ml-4 text-xl font-bold tracking-tight text-white whitespace-nowrap overflow-hidden"
                        >
                            MyDuid
                        </motion.span>
                    )}
                </AnimatePresence>


                <motion.button
                    onClick={toggleSidebar}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:border-teal-500/40 transition-colors z-50 shadow-lg"
                >
                    <motion.div
                        animate={{ rotate: isCollapsed ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <ChevronLeft className="w-3 h-3" />
                    </motion.div>
                </motion.button>
            </div>


            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                <LayoutGroup>
                    <NavLink href="/dashboard" icon={LayoutDashboard} label="Overview" isCollapsed={isCollapsed} active={pathname === "/dashboard"} index={0} />
                    <NavLink href="/dashboard/transactions" icon={CreditCard} label="Transactions" isCollapsed={isCollapsed} active={pathname === "/dashboard/transactions"} index={1} />
                    <NavLink href="/dashboard/goals" icon={Target} label="Goals" isCollapsed={isCollapsed} active={pathname === "/dashboard/goals"} index={2} />
                </LayoutGroup>
            </nav>


            <div className="p-4 border-t border-white/10 bg-black/10">
                <motion.div
                    className={cn("flex items-center gap-3 mb-4 rounded-xl p-2 transition-colors hover:bg-white/[0.04] cursor-default", isCollapsed ? "justify-center" : "")}
                    whileHover={{ scale: 1.01 }}
                >
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

                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -5 }}
                                className="flex-1 min-w-0 overflow-hidden"
                            >
                                <p className="text-sm font-semibold text-white truncate">{user.name || "User"}</p>
                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <motion.button
                    onClick={() => setLogoutOpen(true)}
                    onHoverStart={() => setLogoutHovered(true)}
                    onHoverEnd={() => setLogoutHovered(false)}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                        "flex items-center gap-3 w-full px-3 py-2.5 text-xs font-medium text-gray-500 hover:text-red-400 transition-colors rounded-xl hover:bg-red-500/[0.06] relative overflow-hidden",
                        isCollapsed ? "justify-center" : ""
                    )}
                >
                    <motion.div
                        animate={{ rotate: logoutHovered ? 12 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                    </motion.div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -5 }}
                            >
                                Sign Out
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
                <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
            </div>
        </motion.aside>
    );
}
