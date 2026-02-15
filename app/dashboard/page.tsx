import { getBalance, getTransactions, getMonthlyStats, getFinancialStats } from "@/actions/transaction";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { DashboardChart } from "@/components/DashboardChart";
import { DashboardStats } from "@/components/DashboardStats";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const { data: balanceData } = await getBalance();
    const { data: transactions } = await getTransactions(5);
    const { data: monthlyStats } = await getMonthlyStats();
    const { data: financialStats } = await getFinancialStats();

    return (
        <div className="space-y-6">

            <DashboardStats stats={financialStats || {
                balance: { value: 0, change: 0 },
                income: { value: 0, change: 0 },
                expense: { value: 0, change: 0 }
            }} />


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2">
                    <GlassCard>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-white">Cash Flow Trend</h3>
                            <div className="flex space-x-2">
                                <span className="flex items-center text-xs text-gray-400"><span className="w-2 h-2 rounded-full bg-teal-400 mr-2"></span>Income</span>
                                <span className="flex items-center text-xs text-gray-400"><span className="w-2 h-2 rounded-full bg-rose-400 mr-2"></span>Expenses</span>
                            </div>
                        </div>
                        <DashboardChart data={monthlyStats || []} />
                    </GlassCard>
                </div>
                <div className="lg:col-span-1">
                    <GlassCard className="h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                            <Link href="/dashboard/transactions" className="text-xs text-teal-400 hover:text-teal-300">View All</Link>
                        </div>
                        <TransactionList transactions={transactions || []} compact={true} />
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
