"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/** Fetches transactions (optionally date-filtered) and goals for export. */
export async function getExportData(startDate?: Date, endDate?: Date) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {

        const transactionWhere: Record<string, unknown> = { userId: session.user.id };
        if (startDate && endDate) {
            transactionWhere.date = {
                gte: startDate,
                lte: endDate,
            };
        }

        const transactions = await prisma.transaction.findMany({
            where: transactionWhere,
            orderBy: { date: "desc" },
        });


        const goals = await prisma.goal.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        const serializedTransactions = transactions.map((t) => ({
            ...t,
            amount: Number(t.amount),
        }));

        const serializedGoals = goals.map((g) => ({
            ...g,
            targetAmount: Number(g.targetAmount),
            currentAmount: Number(g.currentAmount),
        }));

        return {
            success: true,
            data: {
                transactions: serializedTransactions,
                goals: serializedGoals,
            },
        };
    } catch (error) {
        console.error("Export data fetch error:", error);
        return { error: "Failed to fetch data for export" };
    }
}
