'use server'

import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { createAuditLog } from "@/lib/audit"

async function checkAdmin() {
    const session = await auth()
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin role required.")
    }
}

export async function getContactMessages() {
    await checkAdmin()
    return await prisma.contactMessage.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
}

export async function markContactMessageRead(id: string) {
    try {
        await checkAdmin()
        const message = await prisma.contactMessage.update({
            where: { id },
            data: { status: "READ" }
        })

        await createAuditLog({
            action: "READ_MESSAGE",
            entity: "ContactMessage",
            entityId: id,
            details: `Olvasottnak jelölve. Küldő: ${message.name} (${message.email})`
        })

        revalidatePath("/admin/contact-messages")
        return { success: true }
    } catch (error: any) {
        console.error("markContactMessageRead error:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteContactMessage(id: string) {
    try {
        await checkAdmin()
        const message = await prisma.contactMessage.delete({
            where: { id }
        })

        await createAuditLog({
            action: "DELETE_MESSAGE",
            entity: "ContactMessage",
            entityId: id,
            details: `Kapcsolat üzenet törölve. Küldő: ${message.name} (${message.email})`
        })

        revalidatePath("/admin/contact-messages")
        return { success: true }
    } catch (error: any) {
        console.error("deleteContactMessage error:", error)
        return { success: false, error: error.message }
    }
}
