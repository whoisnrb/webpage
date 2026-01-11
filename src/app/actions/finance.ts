"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Transactions
export async function getTransactions() {
    return await prisma.transaction.findMany({
        orderBy: { date: "desc" },
    });
}

export async function addTransaction(data: {
    type: string;
    category: string;
    amount: number;
    taxAmount?: number;
    description?: string;
    date?: Date;
}) {
    try {
        const transaction = await prisma.transaction.create({
            data: {
                ...data,
                date: data.date || new Date(),
            },
        });
        revalidatePath("/[locale]/admin/finance", "page");
        return { success: true, transaction };
    } catch (error) {
        console.error("Error adding transaction:", error);
        return { success: false, error: "Nem sikerült a tranzakció rögzítése" };
    }
}

// Subscriptions
export async function getFinancialSubscriptions() {
    return await prisma.financialSubscription.findMany({
        orderBy: { nextBillingDate: "asc" },
    });
}

export async function addFinancialSubscription(data: {
    name: string;
    provider?: string;
    amount: number;
    currency?: string;
    billingCycle: string;
    nextBillingDate?: Date;
}) {
    try {
        const sub = await prisma.financialSubscription.create({
            data,
        });
        revalidatePath("/[locale]/admin/finance", "page");
        return { success: true, subscription: sub };
    } catch (error) {
        console.error("Error adding subscription:", error);
        return { success: false, error: "Nem sikerült az előfizetés rögzítése" };
    }
}

// Stats
export async function getFinanceStats() {
    const transactions = await prisma.transaction.findMany();

    const income = transactions
        .filter((t: any) => t.type === "INCOME")
        .reduce((sum: number, t: any) => sum + t.amount, 0);

    const expenses = transactions
        .filter((t: any) => t.type === "EXPENSE")
        .reduce((sum: number, t: any) => sum + t.amount, 0);

    const taxes = transactions.reduce((sum: number, t: any) => sum + (t.taxAmount || 0), 0);

    return {
        income,
        expenses,
        taxes,
        net: income - expenses - taxes
    };
}
