"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { TransactionForm } from "@/components/TransactionForm";
import { ExportModal } from "@/components/ExportModal";
import { Menu, Download, PlusCircle, LayoutDashboard, CreditCard, Target, Settings, Wallet } from "lucide-react";
import { MobileSidebar } from "@/components/MobileSidebar";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface DashboardHeaderProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

interface PageMeta {
    title: string;
    subtitle: string;
    icon: LucideIcon;
    accent: string;
    gradient: string;
}

const pageConfig: Record<string, PageMeta> = {
    "/dashboard": {
        title: "Dashboard",
        subtitle: "Here's what's happening with your money today.",
        icon: LayoutDashboard,
        accent: "from-teal-400 to-emerald-400",
        gradient: "from-teal-400/20 to-emerald-400/20",
    },
    "/dashboard/transactions": {
        title: "Transactions",
        subtitle: "Manage your income and expenses.",
        icon: CreditCard,
        accent: "from-blue-400 to-indigo-400",
        gradient: "from-blue-400/20 to-indigo-400/20",
    },
    "/dashboard/goals": {
        title: "Saving Goals",
        subtitle: "Track your dreams and targets.",
        icon: Target,
        accent: "from-amber-400 to-orange-400",
        gradient: "from-amber-400/20 to-orange-400/20",
    },
    "/dashboard/budget": {
        title: "Budget",
        subtitle: "Track your spending limits and goals.",
        icon: Wallet,
        accent: "from-purple-400 to-pink-400",
        gradient: "from-purple-400/20 to-pink-400/20",
    },
    "/dashboard/settings": {
        title: "Settings",
        subtitle: "Manage your account preferences.",
        icon: Settings,
        accent: "from-slate-400 to-zinc-400",
        gradient: "from-slate-400/20 to-zinc-400/20",
    },
};

export function DashboardHeader({ user }: DashboardHeaderProps) {
    const pathname = usePathname();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const page = pageConfig[pathname] || pageConfig["/dashboard"];
    const PageIcon = page.icon;

    return (
        <>
            <MobileSidebar
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
                user={user}
            />

            <header className="h-24 flex items-center justify-between px-4 md:px-8 py-6 z-20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMobileSidebarOpen(true)}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors md:hidden"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3">
                        <motion.div
                            key={pathname}
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className={`hidden md:flex w-10 h-10 rounded-xl bg-gradient-to-br ${page.accent} items-center justify-center shadow-lg`}
                            style={{ boxShadow: `0 4px 20px -4px rgba(45, 212, 191, 0.25)` }}
                        >
                            <PageIcon className="w-5 h-5 text-white" />
                        </motion.div>

                        <motion.div
                            key={`text-${pathname}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                                <span className={`bg-gradient-to-r ${page.accent} bg-clip-text text-transparent`}>
                                    {page.title}
                                </span>
                            </h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className={`w-4 h-[2px] rounded-full bg-gradient-to-r ${page.accent} hidden md:block`} />
                                <p className="text-xs md:text-sm text-slate-500 truncate max-w-[200px] md:max-w-none">
                                    {page.subtitle}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="flex items-center space-x-2 md:space-x-4">
                    <div className="hidden md:block">
                        <ExportModal />
                    </div>

                    <div className="md:hidden">
                        <ExportModal trigger={
                            <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-teal-400 hover:text-teal-300 hover:bg-white/10 transition-colors">
                                <Download className="w-5 h-5" />
                            </button>
                        } />
                    </div>

                    <div className="hidden md:block">
                        <TransactionForm />
                    </div>

                    <div className="md:hidden">
                        <TransactionForm trigger={
                            <button className="p-2 rounded-xl bg-teal-500 text-white hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/20">
                                <PlusCircle className="w-5 h-5" />
                            </button>
                        } />
                    </div>
                </div>
            </header>
        </>
    );
}
