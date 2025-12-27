import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { headers } from "next/headers"

type ActionType = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "EXPORT" | "OTHER"

interface LogActionParams {
    action: ActionType
    entity: string
    entityId?: string
    details?: any
}

export async function logAdminAction({ action, entity, entityId, details }: LogActionParams) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            console.warn("Attempted to log admin action without user session")
            return
        }

        // Get IP and User Agent safely
        const headersList = await headers()
        const ipAddress = headersList.get("x-forwarded-for") || "unknown"
        const userAgent = headersList.get("user-agent") || "unknown"

        await prisma.auditLog.create({
            data: {
                action,
                entity,
                entityId,
                details: details ? JSON.stringify(details) : null,
                userId: session.user.id,
                ipAddress,
                userAgent,
            },
        })
    } catch (error) {
        console.error("Failed to create audit log:", error)
        // Don't throw, just log the error so we don't break the main flow
    }
}
