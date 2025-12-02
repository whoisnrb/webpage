import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()
        const { id } = await params

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Nincs bejelentkezve" },
                { status: 401 }
            )
        }

        const ticket = await prisma.ticket.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                replies: {
                    orderBy: {
                        createdAt: 'asc'
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                role: true
                            }
                        }
                    }
                }
            }
        })

        if (!ticket) {
            return NextResponse.json(
                { error: "Ticket nem található" },
                { status: 404 }
            )
        }

        // Check access rights
        const isOwner = ticket.userId === session.user.id
        const isAdmin = session.user.role === "ADMIN"

        if (!isOwner && !isAdmin) {
            return NextResponse.json(
                { error: "Nincs jogosultsága ehhez a tickethez" },
                { status: 403 }
            )
        }

        return NextResponse.json({
            success: true,
            ticket
        })

    } catch (error) {
        console.error("Ticket detail error:", error)
        return NextResponse.json(
            { error: "Hiba történt a ticket lekérése során" },
            { status: 500 }
        )
    }
}
