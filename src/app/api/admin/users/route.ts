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

        // Return users with role ADMIN as potential ticket assignees
        const users = await prisma.user.findMany({
            where: {
                role: "ADMIN"
            },
            select: {
                id: true,
                name: true,
                email: true
            },
            orderBy: {
                name: "asc"
            }
        })

        return NextResponse.json({
            success: true,
            users
        })

    } catch (error) {
        console.error("Admin list error:", error)
        return NextResponse.json(
            { error: "Hiba történt a felhasználók lekérése során" },
            { status: 500 }
        )
    }
}
