"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TransactionSchema, TransactionInput } from "@/lib/schema";
import { revalidatePath } from "next/cache";

/** Returns the authenticated user or throws if not logged in. */
async function getUser() {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    return session.user;
}

/** Creates a new transaction for the authenticated user. */
export async function addTransaction(data: TransactionInput) {
    const user = await getUser();
    const validated = TransactionSchema.safeParse(data);

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    try {
        const transaction = await prisma.transaction.create({
            data: {
                ...validated.data,
                userId: user.id!,
                date: validated.data.date || new Date(),
                description: validated.data.description || "",
            },
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/transactions");

        return {
            success: true,
            data: {
                ...transaction,
                amount: Number(transaction.amount)
            }
        };
    } catch (error) {
        return { error: "Failed to add transaction" };
    }
}

/** Fetches the user's most recent transactions, limited by `limit`. */
export async function getTransactions(limit = 10) {
    const user = await getUser();

    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId: user.id! },
            orderBy: { date: "desc" },
            take: limit,
        });


        const serializedTransactions = transactions.map(t => ({
            ...t,
            amount: Number(t.amount)
        }));

        return { success: true, data: serializedTransactions };
    } catch (error) {
        return { error: "Failed to fetch transactions" };
    }
}

/** Deletes a transaction by ID (must belong to the authenticated user). */
export async function deleteTransaction(id: string) {
    const user = await getUser();

    try {
        await prisma.transaction.delete({
            where: { id, userId: user.id! },
        });
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/transactions");
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete transaction" };
    }
}

/** Calculates the user's all-time income, expense, and net balance. */
export async function getBalance() {
    const user = await getUser();

    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId: user.id! },
        });

        const income = transactions
            .filter((t) => t.type === "INCOME")
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const expense = transactions
            .filter((t) => t.type === "EXPENSE")
            .reduce((sum, t) => sum + Number(t.amount), 0);

        return { success: true, data: { income, expense, balance: income - expense } };
    } catch (error) {
        return { error: "Failed to calculate balance" };
    }
}

/** Aggregates income and expense totals per month for the last 6 months. */
export async function getMonthlyStats() {
    const user = await getUser();
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);

    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: user.id!,
                date: {
                    gte: sixMonthsAgo,
                },
            },
            orderBy: {
                date: "asc",
            },
        });


        const stats = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(today.getFullYear(), today.getMonth() - 5 + i, 1);
            return {
                name: d.toLocaleString("default", { month: "short" }), // Jan, Feb...
                year: d.getFullYear(),
                month: d.getMonth(),
                income: 0,
                expense: 0,
            };
        });


        transactions.forEach((t) => {
            const date = new Date(t.date);
            const monthIndex = stats.findIndex(
                (s) => s.month === date.getMonth() && s.year === date.getFullYear()
            );

            if (monthIndex !== -1) {
                if (t.type === "INCOME") {
                    stats[monthIndex].income += Number(t.amount);
                } else {
                    stats[monthIndex].expense += Number(t.amount);
                }
            } else {

            }
        });

        return { success: true, data: stats };
    } catch (error) {
        return { error: "Failed to fetch monthly stats" };
    }
}

/** Computes dashboard stats: current/previous month comparison with percentage changes. */
export async function getFinancialStats() {
    const user = await getUser();
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: user.id!,
                date: {
                    gte: prevMonthStart,
                    lt: nextMonthStart,
                },
            },
        });


        const calculateStats = (start: Date, end: Date) => {
            const rangeTransactions = transactions.filter(
                (t) => t.date >= start && t.date < end
            );

            const income = rangeTransactions
                .filter((t) => t.type === "INCOME")
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const expense = rangeTransactions
                .filter((t) => t.type === "EXPENSE")
                .reduce((sum, t) => sum + Number(t.amount), 0);

            return { income, expense, balance: income - expense };
        };

        const current = calculateStats(currentMonthStart, nextMonthStart);
        const previous = calculateStats(prevMonthStart, currentMonthStart);


        const calculateChange = (curr: number, prev: number) => {
            if (prev === 0) return curr > 0 ? 100 : 0;
            return ((curr - prev) / prev) * 100;
        };


        const allTransactions = await prisma.transaction.findMany({
            where: { userId: user.id! },
        });
        const totalIncome = allTransactions
            .filter((t) => t.type === "INCOME")
            .reduce((sum, t) => sum + Number(t.amount), 0);
        const totalExpense = allTransactions
            .filter((t) => t.type === "EXPENSE")
            .reduce((sum, t) => sum + Number(t.amount), 0);
        const totalBalance = totalIncome - totalExpense;


        return {
            success: true,
            data: {
                balance: {
                    value: totalBalance,
                    change: calculateChange(current.balance, previous.balance),
                },
                income: {
                    value: current.income,
                    change: calculateChange(current.income, previous.income),
                },
                expense: {
                    value: current.expense,
                    change: calculateChange(current.expense, previous.expense),
                },
            },
        };
    } catch (error) {
        console.error("Failed to fetch financial stats:", error);
        return { error: "Failed to fetch financial stats" };
    }
}
