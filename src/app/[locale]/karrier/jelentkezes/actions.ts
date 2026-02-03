'use server'

import { prisma } from "@/lib/db"

export async function submitApplication(prevState: any, formData: FormData) {
    try {
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const phone = formData.get("phone") as string
        const linkedin = formData.get("linkedin") as string
        const motivation = formData.get("motivation") as string

        // Handle areas manually since they might come as JSON string or individual fields
        const areasRaw = formData.get("areas") as string
        let areas: string[] = []
        if (areasRaw) {
            try {
                areas = JSON.parse(areasRaw)
            } catch (e) {
                areas = [areasRaw]
            }
        }

        const cvFile = formData.get("cv") as File

        if (!cvFile || cvFile.size === 0) {
            return { success: false, error: "CV feltöltése kötelező!" }
        }

        if (cvFile.size > 5 * 1024 * 1024) {
            return { success: false, error: "A fájl mérete túl nagy (max 5MB)!" }
        }

        // Convert File to Buffer
        const buffer = Buffer.from(await cvFile.arrayBuffer())

        await prisma.jobApplication.create({
            data: {
                name,
                email,
                phone,
                linkedin,
                motivation,
                areas,
                cvFile: buffer,
                cvFileName: cvFile.name,
                cvMimeType: cvFile.type,
                status: 'NEW'
            }
        })

        return { success: true }

    } catch (error) {
        console.error("Application submission error:", error)
        return { success: false, error: "Hiba történt a jelentkezés során. Kérjük próbáld újra!" }
    }
}
