'use server'

import { prisma } from "@/lib/db"
import { z } from "zod"
import { processConsultation } from "@/lib/n8n/actions"
import { createAuditLog } from "@/lib/audit"
import { revalidatePath } from "next/cache"

const consultationSchema = z.object({
    name: z.string().min(1, "Név kötelező"),
    email: z.string().email("Érvénytelen email cím"),
    company: z.string().optional(),
    phone: z.string().optional(),
    description: z.string().min(10, "Kérlek írj legalább pár mondatot az elképzelésedről"),
    productId: z.string().optional(),
    packageName: z.string().optional()
})

export type ConsultationInput = z.infer<typeof consultationSchema>

export async function submitConsultation(data: ConsultationInput) {
    try {
        const validated = consultationSchema.parse(data)

        const consultation = await prisma.consultation.create({
            data: {
                name: validated.name,
                email: validated.email,
                company: validated.company,
                phone: validated.phone,
                description: validated.description,
                product: validated.productId ? { connect: { id: validated.productId } } : undefined,
                packageName: validated.packageName
            },
            include: {
                product: true
            }
        })

        // Send notifications
        try {
            await processConsultation({
                action: 'consultation',
                name: consultation.name,
                email: consultation.email,
                company: consultation.company || undefined,
                phone: consultation.phone || undefined,
                description: consultation.description,
                productName: consultation.product?.name,
                packageName: consultation.packageName || undefined,
                type: 'CONSULTATION_REQUEST'
            })
        } catch (notificationError) {
            console.error("Failed to process consultation notifications:", notificationError)
            // Don't fail the request if notification fails, data is saved
        }

        return { success: true }
    } catch (error) {
        console.error("Consultation submission error:", error)
        return { success: false, error: "Hiba történt a kérés feldolgozása során." }
    }
}

export async function updateConsultationStatus(id: string, status: string) {
    try {
        const consultation = await prisma.consultation.update({
            where: { id },
            data: { status }
        })

        await createAuditLog({
            action: "UPDATE_CONSULTATION_STATUS",
            entity: "Consultation",
            entityId: id,
            details: `Konzultáció státusza frissítve: ${status} (${consultation.name} - ${consultation.email})`
        })

        revalidatePath("/admin/consultations")
        return { success: true }
    } catch (error) {
        console.error("updateConsultationStatus error:", error)
        return { success: false }
    }
}

export async function deleteConsultation(id: string) {
    try {
        const consultation = await prisma.consultation.delete({
            where: { id }
        })

        await createAuditLog({
            action: "DELETE_CONSULTATION",
            entity: "Consultation",
            entityId: id,
            details: `Konzultáció törölve: ${consultation.name} (${consultation.email})`
        })

        revalidatePath("/admin/consultations")
        return { success: true }
    } catch (error) {
        console.error("Error deleting consultation:", error)
        return { success: false }
    }
}
