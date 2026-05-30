import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { headers } from "next/headers"

export type ActionType = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "EXPORT" | "OTHER"

export interface LogActionParams {
    action: ActionType
    entity: string
    entityId?: string
    details?: unknown
}

// Original helper for backwards compatibility
export async function logAdminAction({ action, entity, entityId, details }: LogActionParams) {
    try {
        const detailsString = details 
            ? (typeof details === 'string' ? details : JSON.stringify(details)) 
            : null

        await createAuditLog({
            action,
            entity,
            entityId,
            details: detailsString
        })
    } catch (error) {
        console.error("[logAdminAction] Error:", error)
    }
}

// New helper for general text logs
export async function createAuditLog({
    action,
    entity,
    entityId,
    details
}: {
    action: string
    entity: string
    entityId?: string
    details?: string | null
}) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            console.warn(`[AuditLog] Cannot log action "${action}" on ${entity}: No authenticated user.`)
            return
        }

        let ipAddress = "unknown"
        let userAgent = "unknown"

        try {
            const headersList = await headers()
            ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown"
            userAgent = headersList.get("user-agent") || "unknown"
        } catch (headerError) {
            console.debug("[AuditLog] Failed to fetch headers, using fallback values.")
        }

        await prisma.auditLog.create({
            data: {
                action,
                entity,
                entityId,
                details: details || null,
                userId: session.user.id,
                ipAddress,
                userAgent
            }
        })
        console.log(`[AuditLog] Action "${action}" on ${entity} logged successfully.`)
    } catch (error) {
        console.error("[AuditLog] Failed to create audit log:", error)
    }
}
