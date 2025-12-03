import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE() {
    const session = await auth()

    if (!session?.user?.email) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return new NextResponse("User not found", { status: 404 })
        }

        // Check for active orders or other constraints if necessary
        // For now, we attempt to delete. If there are restrict relations (like Orders), this might fail.
        // We should handle that gracefully.

        // Option: Anonymize orders before deleting user?
        // For this implementation, we will try to delete the user. 
        // If it fails due to foreign key constraints (e.g. Orders), we return a 409 Conflict.

        await prisma.user.delete({
            where: { id: user.id },
        })

        return new NextResponse("User deleted successfully", { status: 200 })
    } catch (error) {
        console.error("Error deleting user:", error)
        // Check if error is due to foreign key constraint
        // @ts-ignore
        if (error.code === 'P2003') {
            return new NextResponse("Cannot delete account with existing orders. Please contact support.", { status: 409 })
        }
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
