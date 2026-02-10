import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await auth()

    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const userData = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                tickets: {
                    include: {
                        replies: true,
                    }
                },
            },
        })

        if (!userData) {
            return new NextResponse("User not found", { status: 404 })
        }

        // Remove sensitive fields like password if present (though usually null for OAuth)
        const { password, ...safeUserData } = userData

        return NextResponse.json(safeUserData, {
            headers: {
                "Content-Disposition": `attachment; filename="user-data-${userData.id}.json"`,
            },
        })
    } catch (error) {
        console.error("Error exporting user data:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
