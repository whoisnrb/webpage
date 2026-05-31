import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Nincs jogosultsága" },
                { status: 403 }
            )
        }

        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "20")
        const search = searchParams.get("search") || ""
        const actionType = searchParams.get("actionType") || "ALL"
        const entityType = searchParams.get("entityType") || "ALL"

        const skip = (page - 1) * limit

        // Build filtering conditions
        const where: any = {}

        if (search) {
            where.OR = [
                { action: { contains: search, mode: "insensitive" } },
                { entity: { contains: search, mode: "insensitive" } },
                { entityId: { contains: search, mode: "insensitive" } },
                { details: { contains: search, mode: "insensitive" } },
                {
                    user: {
                        OR: [
                            { name: { contains: search, mode: "insensitive" } },
                            { email: { contains: search, mode: "insensitive" } }
                        ]
                    }
                }
            ]
        }

        if (actionType !== "ALL") {
            where.action = actionType
        }

        if (entityType !== "ALL") {
            where.entity = entityType
        }

        // Fetch logs and count concurrently
        const [logs, total] = await prisma.$transaction([
            prisma.auditLog.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            }),
            prisma.auditLog.count({ where })
        ])

        // Get unique entity names for the filter dropdown
        const uniqueEntities = await prisma.auditLog.groupBy({
            by: ["entity"],
            _count: true
        })

        // Get unique action types for the filter dropdown
        const uniqueActions = await prisma.auditLog.groupBy({
            by: ["action"],
            _count: true
        })

        return NextResponse.json({
            success: true,
            logs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            filters: {
                entities: uniqueEntities.map(e => e.entity),
                actions: uniqueActions.map(a => a.action)
            }
        })

    } catch (error) {
        console.error("Audit log fetch error:", error)
        return NextResponse.json(
            { error: "Hiba történt a naplóbejegyzések lekérése során" },
            { status: 500 }
        )
    }
}
