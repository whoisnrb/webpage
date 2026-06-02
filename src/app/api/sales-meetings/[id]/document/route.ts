import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/auth"

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const meeting = await prisma.salesMeeting.findUnique({
            where: { id: params.id },
            select: {
                documentFile: true,
                documentFileName: true,
                documentMimeType: true,
            }
        })

        if (!meeting || !meeting.documentFile) {
            return new NextResponse("Document not found", { status: 404 })
        }

        // Return the file as a response
        return new NextResponse(meeting.documentFile, {
            headers: {
                "Content-Type": meeting.documentMimeType || "application/octet-stream",
                "Content-Disposition": `attachment; filename="${meeting.documentFileName || 'document.pdf'}"`,
            }
        })

    } catch (error) {
        console.error("Error downloading document:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
