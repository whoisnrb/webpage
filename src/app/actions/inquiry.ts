'use server'

import { prisma } from "@/lib/db"
import { z } from "zod"
import { sendAdminInquiryNotification, sendClientInquiryConfirmationEmail } from "@/lib/mail"
import { revalidatePath } from "next/cache"
import { createAuditLog } from "@/lib/audit"

const inquirySchema = z.object({
    name: z.string().min(1, "Név kötelező"),
    email: z.string().email("Érvénytelen email cím"),
    phone: z.string().optional(),
    company: z.string().optional(),
    serviceType: z.string().min(1, "Szolgáltatás kiválasztása kötelező"),
    budget: z.string().optional(),
    description: z.string().optional().default(""),
    locale: z.enum(["hu", "en"]).optional(),
})

export type InquiryInput = z.infer<typeof inquirySchema>

export async function submitInquiry(data: InquiryInput) {
    try {
        const parsed = inquirySchema.safeParse(data)
        if (!parsed.success) {
            return {
                success: false,
                error: parsed.error.issues[0]?.message || "Érvénytelen adatok.",
            }
        }

        const { locale, description, ...rest } = parsed.data
        const inquiry = await prisma.serviceInquiry.create({
            data: {
                ...rest,
                description: description?.trim() || "Nincs külön leírás megadva.",
            },
        })

        // Notify Admin and send confirmation email to the lead
        const [adminResult, clientResult] = await Promise.allSettled([
            sendAdminInquiryNotification(inquiry),
            sendClientInquiryConfirmationEmail({
                name: inquiry.name,
                email: inquiry.email,
                serviceType: inquiry.serviceType,
                budget: inquiry.budget,
                description: inquiry.description,
                locale,
            }),
        ])

        if (adminResult.status === "rejected") {
            console.error("Failed to send admin notification:", adminResult.reason)
        }
        if (clientResult.status === "rejected") {
            console.error("Failed to send client confirmation:", clientResult.reason)
        }

        revalidatePath("/admin/inquiries")
        return { success: true }
    } catch (error) {
        console.error("Inquiry submission error:", error)
        return { success: false, error: "Hiba történt a küldés során." }
    }
}

export async function updateInquiryStatus(id: string, status: string) {
    try {
        const inquiry = await prisma.serviceInquiry.update({
            where: { id },
            data: { status }
        })

        await createAuditLog({
            action: "UPDATE_INQUIRY_STATUS",
            entity: "ServiceInquiry",
            entityId: id,
            details: `Megkeresés státusza módosítva erre: ${status} (${inquiry.name} - ${inquiry.email})`
        })

        revalidatePath("/admin/inquiries")
        return { success: true }
    } catch (error) {
        console.error("updateInquiryStatus error:", error)
        return { success: false }
    }
}

export async function updateInquiryPaymentLink(id: string, paymentLink: string) {
    try {
        const inquiry = await prisma.serviceInquiry.update({
            where: { id },
            data: { 
                stripePaymentLink: paymentLink,
                status: "QUOTED" // Automatically move to quoted when a link is added
            }
        })
        
        await createAuditLog({
            action: "UPDATE_INQUIRY_PAYMENT",
            entity: "ServiceInquiry",
            entityId: id,
            details: `Stripe fizetési link mentve ehhez a megkereséshez: ${inquiry.name} (${inquiry.email})`
        })

        // This will be handled in the Admin UI or here
        // The user wants "auto-feedback", so let's trigger it if the link is not empty
        if (paymentLink) {
            const { sendPaymentLinkEmail } = await import("@/lib/mail")
            await sendPaymentLinkEmail(
                inquiry.email, 
                inquiry.name, 
                inquiry.serviceType, 
                paymentLink
            )
        }

        revalidatePath("/admin/inquiries")
        return { success: true }
    } catch (error) {
        console.error("Error updating payment link:", error)
        return { success: false }
    }
}

export async function deleteInquiry(id: string) {
    try {
        const inquiry = await prisma.serviceInquiry.delete({
            where: { id }
        })

        await createAuditLog({
            action: "DELETE_INQUIRY",
            entity: "ServiceInquiry",
            entityId: id,
            details: `Megkeresés törölve: ${inquiry.name} (${inquiry.email})`
        })

        revalidatePath("/admin/inquiries")
        return { success: true }
    } catch (error) {
        console.error("Error deleting inquiry:", error)
        return { success: false }
    }
}
