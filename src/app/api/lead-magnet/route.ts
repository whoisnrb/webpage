import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"

const leadSchema = z.object({
    name: z.string().optional(),
    email: z.string().email("Érvénytelen e-mail cím"),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const result = leadSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: "Érvénytelen adatok", details: result.error.flatten() },
                { status: 400 }
            )
        }

        const { email, name } = result.data

        // Check if email already exists
        const existingLead = await prisma.lead.findUnique({
            where: { email },
        })

        if (existingLead) {
            return NextResponse.json(
                { message: "Ez az e-mail cím már fel van iratkozva!" },
                { status: 200 }
            )
        }

        await prisma.lead.create({
            data: {
                email,
                name,
                source: "lead-magnet",
            },
        })

        return NextResponse.json(
            { message: "Sikeres feliratkozás! Hamarosan küldjük az anyagot." },
            { status: 201 }
        )
    } catch (error) {
        console.error("Lead magnet error:", error)
        return NextResponse.json(
            { error: "Hiba történt a feliratkozás során." },
            { status: 500 }
        )
    }
}
