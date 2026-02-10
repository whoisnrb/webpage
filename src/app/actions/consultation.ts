'use server'

import { prisma } from "@/lib/db"
import { z } from "zod"
import { processConsultation } from "@/lib/n8n/actions"

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
