"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const GoalSchema = z.object({
    name: z.string().min(1, "Name is required"),
    targetAmount: z.coerce.number().min(1, "Target amount must be at least 1"),
    currentAmount: z.coerce.number().min(0).default(0),
    deadline: z.coerce.date().optional(),
});

/** Fetches all savings goals for the authenticated user. */
export async function getGoals() {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        const goals = await prisma.goal.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        const serializedGoals = goals.map((goal) => ({
            ...goal,
            targetAmount: goal.targetAmount.toNumber(),
            currentAmount: goal.currentAmount.toNumber(),
        }));

        return { success: true, data: serializedGoals };
    } catch (error) {
        return { error: "Failed to fetch goals" };
    }
}

/** Creates a new savings goal from form data. */
export async function createGoal(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const validated = GoalSchema.safeParse({
        name: formData.get("name"),
        targetAmount: formData.get("targetAmount"),
        deadline: formData.get("deadline") || undefined,
    });

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors };
    }

    try {
        await prisma.goal.create({
            data: {
                ...validated.data,
                userId: session.user.id,
            },
        });
        revalidatePath("/dashboard/goals");
        return { success: true };
    } catch (error) {
        return { error: "Failed to create goal" };
    }
}

/** Deposits funds into a goal (atomically validates balance, updates goal, and creates an expense transaction). */
export async function updateGoalAmount(id: string, amount: number) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        const userId = session.user.id;

        const result = await prisma.$transaction(async (tx) => {
            const transactions = await tx.transaction.findMany({
                where: { userId },
            });

            const income = transactions
                .filter((t) => t.type === "INCOME")
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const expense = transactions
                .filter((t) => t.type === "EXPENSE")
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const balance = income - expense;


            if (balance < amount) {
                throw new Error("Insufficient balance");
            }


            const goal = await tx.goal.findUnique({
                where: { id, userId },
            });

            if (!goal) throw new Error("Goal not found");

            const newAmount = Number(goal.currentAmount) + amount;


            await tx.goal.update({
                where: { id },
                data: { currentAmount: newAmount },
            });

            await tx.transaction.create({
                data: {
                    amount: amount,
                    description: `Savings for ${goal.name}`,
                    date: new Date(),
                    category: "Savings",
                    type: "EXPENSE",
                    userId,
                },
            });

            return { success: true };
        });

        revalidatePath("/dashboard/goals");
        revalidatePath("/dashboard");
        revalidatePath("/dashboard/transactions");
        return result;

    } catch (error: any) {
        if (error.message === "Insufficient balance") {
            return { error: "Insufficient balance" };
        }
        return { error: "Failed to update goal" };
    }
}

/** Deletes a savings goal by ID. */
export async function deleteGoal(id: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await prisma.goal.delete({
            where: { id, userId: session.user.id },
        });
        revalidatePath("/dashboard/goals");
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete goal" };
    }
}
