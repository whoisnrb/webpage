'use server'

import { prisma } from "@/lib/db"
import { z } from "zod"
import { sendAdminInquiryNotification } from "@/lib/mail"
import { revalidatePath } from "next/cache"

const inquirySchema = z.object({
    name: z.string().min(1, "Név kötelező"),
    email: z.string().email("Érvénytelen email cím"),
    phone: z.string().optional(),
    company: z.string().optional(),
    serviceType: z.string().min(1, "Szolgáltatás kiválasztása kötelező"),
    budget: z.string().optional(),
    description: z.string().min(1, "Leírás kötelező")
})

export type InquiryInput = z.infer<typeof inquirySchema>

export async function submitInquiry(data: InquiryInput) {
    try {
        const validated = inquirySchema.parse(data)

        const inquiry = await prisma.serviceInquiry.create({
            data: validated
        })

        // Notify Admin
        try {
            await sendAdminInquiryNotification(inquiry)
        } catch (error) {
            console.error("Failed to send admin notification:", error)
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
        await prisma.serviceInquiry.update({
            where: { id },
            data: { status }
        })
        revalidatePath("/admin/inquiries")
        return { success: true }
    } catch (error) {
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
