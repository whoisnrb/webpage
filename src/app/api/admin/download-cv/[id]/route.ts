import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth()

        // 1. Check Auth (Admin only)
        if (!session?.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { id } = await params

        // 2. Fetch Application
        const app = await prisma.jobApplication.findUnique({
            where: { id },
            select: {
                cvFile: true,
                cvFileName: true,
                cvMimeType: true
            }
        })

        if (!app || !app.cvFile) {
            return new NextResponse("File not found", { status: 404 })
        }

        // 3. Return file
        return new NextResponse(app.cvFile, {
            headers: {
                "Content-Type": app.cvMimeType || "application/octet-stream",
                "Content-Disposition": `attachment; filename="${app.cvFileName || 'cv.pdf'}"`
            }
        })

    } catch (error) {
        console.error("Download error:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
