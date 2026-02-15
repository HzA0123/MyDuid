import { z } from "zod";

export const TransactionSchema = z.object({
    amount: z.coerce.number().positive("Amount must be positive"),
    description: z.string().optional().or(z.literal("")),
    category: z.string().min(1, "Category is required"),
    type: z.enum(["INCOME", "EXPENSE"]),
    date: z.coerce.date().optional(),
});

export const BudgetSchema = z.object({
    category: z.string().min(1, "Category is required"),
    limit: z.coerce.number().positive("Limit must be positive"),
});

export type TransactionInput = z.infer<typeof TransactionSchema>;
export type BudgetInput = z.infer<typeof BudgetSchema>;
