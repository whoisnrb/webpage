"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getLeads() {
    try {
        return await prisma.lead.findMany({
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("Error fetching leads:", error);
        return [];
    }
}

export async function updateLead(id: string, data: {
    name?: string;
    companyName?: string;
    email?: string;
    status?: string;
    notes?: string;
    lastContactedAt?: Date;
}) {
    try {
        const updatedLead = await prisma.lead.update({
            where: { id },
            data,
        });
        revalidatePath("/[locale]/admin/crm", "page");
        return { success: true, lead: updatedLead };
    } catch (error) {
        console.error("Error updating lead:", error);
        return { success: false, error: "Nem sikerült a frissítés" };
    }
}

export async function deleteLead(id: string) {
    try {
        await prisma.lead.delete({
            where: { id },
        });
        revalidatePath("/[locale]/admin/crm", "page");
        return { success: true };
    } catch (error) {
        console.error("Error deleting lead:", error);
        return { success: false, error: "Nem sikerült a törlés" };
    }
}

export async function createLead(data: {
    name: string;
    companyName?: string;
    email: string;
    source: string;
    status?: string;
    notes?: string;
}) {
    try {
        const lead = await prisma.lead.create({
            data,
        });
        revalidatePath("/[locale]/admin/crm", "page");
        return { success: true, lead };
    } catch (error) {
        console.error("Error creating lead:", error);
        return { success: false, error: "Nem sikerült a létrehozás" };
    }
}
