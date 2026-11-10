'use server'

import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { createAuditLog } from "@/lib/audit"
import { revalidatePath } from "next/cache"

export type RoleType = 'SUPER_ADMIN' | 'ADMIN' | 'DEVELOPER' | 'SALES' | 'USER'

export type TeamMemberDTO = {
    id: string
    name: string | null
    email: string | null
    role: string
    image: string | null
    createdAt: Date
    updatedAt: Date
    ticketCount: number
    projectCount: number
}

export async function getTeamMembers(query?: string, roleFilter?: string): Promise<TeamMemberDTO[]> {
    const session = await auth()
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role || '')) {
        throw new Error("Nincs jogosultságod a csapat megtekintéséhez.")
    }

    const where: any = {}
    if (query) {
        where.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
        ]
    }
    if (roleFilter && roleFilter !== 'ALL') {
        where.role = roleFilter
    }

    const users = await prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            createdAt: true,
            updatedAt: true,
            _count: {
                select: {
                    tickets: true,
                    projects: true
                }
            }
        }
    })

    return users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role || 'USER',
        image: u.image,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        ticketCount: u._count.tickets,
        projectCount: u._count.projects
    }))
}

export async function updateUserRole(targetUserId: string, newRole: RoleType) {
    const session = await auth()
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role || '')) {
        throw new Error("Csak rendszergazda módosíthatja a szerepköröket.")
    }

    const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId }
    })
    if (!targetUser) {
        throw new Error("A megadott felhasználó nem található.")
    }

    // Biztonsági védelem: saját magát ne fokozhassa le a legutolsó admin
    if (session.user.id === targetUserId && newRole !== 'ADMIN' && newRole !== 'SUPER_ADMIN') {
        throw new Error("Saját magadról nem veheted el a rendszergazdai jogosultságot.")
    }

    const updated = await prisma.user.update({
        where: { id: targetUserId },
        data: { role: newRole }
    })

    await createAuditLog({
        action: "UPDATE_USER_ROLE",
        entity: "User",
        entityId: targetUserId,
        details: `Felhasználó szerepköre módosítva: ${targetUser.email} -> ${newRole} (Módosította: ${session.user.email})`
    })

    revalidatePath('/admin/team')
    revalidatePath('/admin')
    return { success: true, updatedRole: updated.role }
}
