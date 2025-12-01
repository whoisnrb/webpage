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
        const ticketCount = await prisma.ticket.count()
        const ticketNumber = `TKT-${String(ticketCount + 1).padStart(4, '0')}`

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

        // TODO: n8n webhook notification to admins (will be added later)

        return NextResponse.json({
            success: true,
            ticket
        }, { status: 201 })

    } catch (error) {
        console.error("Ticket creation error:", error)
        return NextResponse.json(
            { error: "Hiba történt a ticket létrehozása során" },
            { status: 500 }
        )
    }
}
