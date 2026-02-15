import { getGoals } from "@/actions/goal";
import { GoalCard } from "@/components/GoalCard";
import { GoalForm } from "@/components/GoalForm";
import { GlassCard } from "@/components/ui/GlassCard";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
    const { data: goals } = await getGoals();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                </div>
                <GoalForm />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                {goals && goals.length > 0 ? (
                    goals.map((goal) => (
                        <GoalCard key={goal.id} goal={goal} />
                    ))
                ) : (
                    <GlassCard className="col-span-full py-16 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                <span className="text-4xl">🎯</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white">No Saving Goals Yet</h3>
                            <p className="text-gray-400 max-w-md mx-auto">
                                Start tracking your dreams! Create a saving goal to visualize your progress and stay motivated.
                            </p>
                            <div className="pt-4">
                            </div>
                        </div>
                    </GlassCard>
                )}
            </div>
        </div>
    );
}
