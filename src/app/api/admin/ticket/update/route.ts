import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { logAdminAction } from "@/lib/audit"

export async function POST(req: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.id || session.user.role !== "ADMIN") {
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

        // Prepare update data
        const updateData: any = {
            updatedAt: new Date()
        }

        if (status) updateData.status = status
        if (priority) updateData.priority = priority
        if (assignedToId) updateData.assignedToId = assignedToId

        const ticket = await prisma.ticket.update({
            where: { id: ticketId },
            data: updateData,
            include: {
                assignedTo: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        // Log the action
        await logAdminAction({
            action: "UPDATE",
            entity: "Ticket",
            entityId: ticket.id,
            details: updateData
        })

        return NextResponse.json({
            success: true,
            ticket
        })

    } catch (error) {
        console.error("Ticket update error:", error)
        return NextResponse.json(
            { error: "Hiba történt a ticket frissítése során" },
            { status: 500 }
        )
    }
}
