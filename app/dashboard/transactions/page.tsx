import { getTransactions, getMonthlyStats } from "@/actions/transaction";
import { getGoals } from "@/actions/goal";
import { TransactionList } from "@/components/TransactionList";
import { GlassCard } from "@/components/ui/GlassCard";
import { DashboardChart } from "@/components/DashboardChart";
import { GoalCard } from "@/components/GoalCard";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {

    const { data: transactions } = await getTransactions(50);
    const { data: monthlyStats } = await getMonthlyStats();
    const { data: goals } = await getGoals();

    return (
        <div className="space-y-6">


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-1 space-y-6">
                    <GlassCard>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-white">Cash Flow</h3>
                        </div>
                        <DashboardChart data={monthlyStats || []} />
                    </GlassCard>


                    <GlassCard className="p-0 overflow-hidden">
                        <div className="p-6 pb-2">
                            <h3 className="text-lg font-semibold text-white">Your Goals</h3>
                        </div>
                        <div className="p-6 pt-2 space-y-6">
                            {goals && goals.length > 0 ? (
                                goals.map((goal: { id: string; name: string; targetAmount: number; currentAmount: number; deadline?: Date | null }, index: number) => (
                                    <div key={goal.id} className={index !== goals.length - 1 ? "pb-6 border-b border-white/5" : ""}>
                                        <GoalCard goal={goal} compact={true} hideWrapper={true} />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 py-4">
                                    <p>No goals yet.</p>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </div>
                <div className="lg:col-span-2">
                    <GlassCard>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-white">All Transactions</h3>

                        </div>
                        <TransactionList transactions={transactions || []} />
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
