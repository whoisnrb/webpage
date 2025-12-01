import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Nincs bejelentkezve" },
                { status: 401 }
            )
        }

        // Get user's tickets with reply count
        const tickets = await prisma.ticket.findMany({
            where: {
                userId: session.user.id
            },
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
                replies: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1,
                    select: {
                        content: true,
                        createdAt: true,
                        isStaffReply: true
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
        console.error("Ticket list error:", error)
        return NextResponse.json(
            { error: "Hiba történt a ticketek lekérése során" },
            { status: 500 }
        )
    }
}
