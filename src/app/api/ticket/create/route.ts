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
        const { subject, description, category, priority } = body

        // Validation
        if (!subject || subject.trim().length === 0) {
            return NextResponse.json(
                { error: "A tárgy mező kötelező" },
                { status: 400 }
            )
        }

        if (subject.length > 200) {
            return NextResponse.json(
                { error: "A tárgy maximum 200 karakter lehet" },
                { status: 400 }
            )
        }

        if (!description || description.trim().length < 20) {
            return NextResponse.json(
                { error: "A leírás minimum 20 karakter kell legyen" },
                { status: 400 }
            )
        }

        const validCategories = ["TECHNICAL", "BILLING", "GENERAL", "BUG_REPORT"]
        const validPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"]

        if (category && !validCategories.includes(category)) {
            return NextResponse.json(
                { error: "Érvénytelen kategória" },
                { status: 400 }
            )
        }

        if (priority && !validPriorities.includes(priority)) {
            return NextResponse.json(
                { error: "Érvénytelen prioritás" },
                { status: 400 }
            )
        }

        // Generate unique ticket number
        const lastTicket = await prisma.ticket.findFirst({
            orderBy: { ticketNumber: 'desc' },
            select: { ticketNumber: true }
        })

        let nextNumber = 1
        if (lastTicket?.ticketNumber) {
            const parts = lastTicket.ticketNumber.split('-')
            if (parts.length === 2) {
                const num = parseInt(parts[1], 10)
                if (!isNaN(num)) {
                    nextNumber = num + 1
                }
            }
        }

        const ticketNumber = `TKT-${String(nextNumber).padStart(4, '0')}`

        // Create ticket
        const ticket = await prisma.ticket.create({
            data: {
                ticketNumber,
                subject: subject.trim(),
                description: description.trim(),
                category: category || "GENERAL",
                priority: priority || "MEDIUM",
                userId: session.user.id,
                status: "OPEN"
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        // Notify internal action for Admin Alert
        try {
            const { processTicket } = await import("@/lib/n8n/actions")
            await processTicket({
                action: "ticket_created",
                ticketId: ticket.id,
                ticketNumber: ticket.ticketNumber,
                subject: ticket.subject,
                description: ticket.description,
                userEmail: ticket.user.email || undefined,
                userName: ticket.user.name || undefined
            });
        } catch (webhookError) {
            console.error("Internal processTicket trigger failed:", webhookError);
            // Continue execution, don't block user
        }

        return NextResponse.json({
            success: true,
            ticket
        }, { status: 201 })

    } catch (error) {
        console.error("Ticket creation error:", error)
        return NextResponse.json(
            {
                error: "Hiba történt a ticket létrehozása során",
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        )
    }
}
