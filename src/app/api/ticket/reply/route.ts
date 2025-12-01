import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Nincs bejelentkezve" },
                { status: 401 }
            )
        }

        const body = await req.json()
        const { ticketId, content } = body

        // Validation
        if (!ticketId) {
            return NextResponse.json(
                { error: "Ticket ID kötelező" },
                { status: 400 }
            )
        }

        if (!content || content.trim().length < 10) {
            return NextResponse.json(
                { error: "A válasz minimum 10 karakter kell legyen" },
                { status: 400 }
            )
        }

        // Check ticket exists and user has access
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
            include: { user: true }
        })

        if (!ticket) {
            return NextResponse.json(
                { error: "Ticket nem található" },
                { status: 404 }
            )
        }

        // Check if user owns the ticket or is admin
        const isOwner = ticket.userId === session.user.id
        const isAdmin = session.user.role === "ADMIN"

        if (!isOwner && !isAdmin) {
            return NextResponse.json(
                { error: "Nincs jogosultsága ehhez a tickethez" },
                { status: 403 }
            )
        }

        // Check if ticket is closed
        if (ticket.status === "CLOSED") {
            return NextResponse.json(
                { error: "Lezárt tickethez nem lehet választ írni" },
                { status: 400 }
            )
        }

        // Create reply
        const reply = await prisma.ticketReply.create({
            data: {
                content: content.trim(),
                ticketId,
                userId: session.user.id,
                isStaffReply: isAdmin
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            }
        })

        // Update ticket updatedAt timestamp
        await prisma.ticket.update({
            where: { id: ticketId },
            data: { updatedAt: new Date() }
        })

        // TODO: n8n webhook notification (will be added later)
        // If staff reply -> notify customer
        // If customer reply -> notify assigned admin or all admins

        return NextResponse.json({
            success: true,
            reply
        }, { status: 201 })

    } catch (error) {
        console.error("Ticket reply error:", error)
        return NextResponse.json(
            { error: "Hiba történt a válasz elküldése során" },
            { status: 500 }
        )
    }
}
