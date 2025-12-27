import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { logAdminAction } from "@/lib/audit"

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const body = await req.json()
        const { id, enabled } = body

        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 })

        const flag = await prisma.featureFlag.update({
            where: { id },
            data: { enabled }
        })

        await logAdminAction({
            action: "UPDATE",
            entity: "FeatureFlag",
            entityId: id,
            details: { enabled }
        })

        return NextResponse.json({ success: true, flag })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Error" }, { status: 500 })
    }
}
