"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"

type EventProperties = Record<string, string | number | boolean | null>

export async function trackEvent(name: string, category: string = "general", properties?: EventProperties) {
    try {
        const session = await auth()
        const userId = session?.user?.id

        await prisma.analyticsEvent.create({
            data: {
                name,
                category,
                properties: properties || {},
                userId
            }
        })
    } catch (error) {
        // Analytics should fail silently to not disrupt UX
        console.error("Analytics Error:", error)
    }
}
