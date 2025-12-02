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

        const tickets = await prisma.ticket.findMany({
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
