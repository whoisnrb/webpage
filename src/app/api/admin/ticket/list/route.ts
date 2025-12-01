import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Nincs jogosultsága" },
                { status: 403 }
            )
        }

        const { searchParams } = new URL(req.url)
        const status = searchParams.get('status')
        const priority = searchParams.get('priority')
        const category = searchParams.get('category')
        const search = searchParams.get('search')

        // Build where clause
        const where: any = {}

        if (status) {
            where.status = status
        }

        if (priority) {
            where.priority = priority
        }

        if (category) {
            where.category = category
        }

        if (search) {
            where.OR = [
                { subject: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { ticketNumber: { contains: search, mode: 'insensitive' } }
            ]
        }

        // Get tickets
        const tickets = await prisma.ticket.findMany({
            where,
            orderBy: {
                updatedAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                assignedTo: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                _count: {
                    select: {
                        replies: true
                    }
                }
            }
        })

        return NextResponse.json({
            success: true,
            tickets
        })

    } catch (error) {
        console.error("Admin ticket list error:", error)
        return NextResponse.json(
            { error: "Hiba történt a ticketek lekérése során" },
            { status: 500 }
        )
    }
}
