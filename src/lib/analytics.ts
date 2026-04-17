"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"

type EventProperties = Record<string, string | number | boolean | null>

export async function trackEvent(name: string, category: string = "general", properties?: EventProperties) {
    try {
        let userId: string | undefined

        try {
            const session = await auth()
            userId = session?.user?.id
        } catch (authError: any) {
            // Handle Next.js Dynamic Server Usage error during static pre-rendering
            const isDynamicError = 
                authError?.digest?.includes("DYNAMIC_SERVER_USAGE") || 
                authError?.message?.includes("DYNAMIC_SERVER_USAGE") ||
                authError?.name === "DynamicServerUsageError";

            if (isDynamicError) {
                userId = undefined
            } else {
                throw authError
            }
        }

        await prisma.analyticsEvent.create({
            data: {
                name,
                category,
                properties: properties || {},
                userId
            }
        })
    } catch (error: any) {
        // Analytics should fail silently to not disrupt UX
        const isDynamicError = 
            error?.digest?.includes("DYNAMIC_SERVER_USAGE") || 
            error?.message?.includes("DYNAMIC_SERVER_USAGE") ||
            error?.name === "DynamicServerUsageError";

        if (!isDynamicError) {
            console.error("Analytics Error:", error)
        }
    }
}
