import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function PATCH(req: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Nincs jogosultsága" },
                { status: 403 }
            )
        }

        const body = await req.json()
        const { ticketId, status, priority, assignedToId } = body

        if (!ticketId) {
            return NextResponse.json(
                { error: "Ticket ID kötelező" },
                { status: 400 }
            )
        }

        // Check ticket exists
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId }
        })

        if (!ticket) {
            return NextResponse.json(
                { error: "Ticket nem található" },
                { status: 404 }
            )
        }

        // Build update data
        const updateData: any = {}

        if (status) {
            const validStatuses = ["OPEN", "IN_PROGRESS", "WAITING_FOR_CUSTOMER", "RESOLVED", "CLOSED"]
            if (!validStatuses.includes(status)) {
                return NextResponse.json(
                    { error: "Érvénytelen státusz" },
                    { status: 400 }
                )
            }
            updateData.status = status

            // If closing ticket, set closedAt
            if (status === "CLOSED" && !ticket.closedAt) {
                updateData.closedAt = new Date()
            }
        }

        if (priority) {
            const validPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"]
            if (!validPriorities.includes(priority)) {
                return NextResponse.json(
                    { error: "Érvénytelen prioritás" },
                    { status: 400 }
                )
            }
            updateData.priority = priority
        }

        if (assignedToId !== undefined) {
            // Allow null to unassign
            if (assignedToId === null) {
                updateData.assignedToId = null
            } else {
                // Verify user exists and is admin
                const assignedUser = await prisma.user.findUnique({
                    where: { id: assignedToId }
                })

                if (!assignedUser || assignedUser.role !== "ADMIN") {
                    return NextResponse.json(
                        { error: "Érvénytelen admin felhasználó" },
                        { status: 400 }
                    )
                }
                updateData.assignedToId = assignedToId
            }
        }

        // Update ticket
        const updatedTicket = await prisma.ticket.update({
            where: { id: ticketId },
            data: updateData,
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
                }
            }
        })

        return NextResponse.json({
            success: true,
            ticket: updatedTicket
        })

    } catch (error) {
        console.error("Admin ticket update error:", error)
        return NextResponse.json(
            { error: "Hiba történt a ticket frissítése során" },
            { status: 500 }
        )
    }
}
