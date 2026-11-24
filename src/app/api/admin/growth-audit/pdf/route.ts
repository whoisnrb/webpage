import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { generateGrowthAuditPdfBuffer } from "@/lib/pdf/growth-audit-pdf"
import type { GrowthAuditReport } from "@/app/actions/growth-audit"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        const role = session?.user?.role || ""

        if (!session?.user || !["ADMIN", "SUPER_ADMIN", "DEVELOPER", "SALES"].includes(role)) {
            return NextResponse.json(
                { error: "Nincs jogosultság a PDF exportáláshoz." },
                { status: 403 }
            )
        }

        const report = (await req.json()) as GrowthAuditReport
        if (!report || !report.domain || !report.pillars) {
            return NextResponse.json(
                { error: "Hiányzó vagy érvénytelen audit jelentés adatok." },
                { status: 400 }
            )
        }

        const pdfBuffer = await generateGrowthAuditPdfBuffer(report)
        const safeDomain = report.domain.replace(/[^a-zA-Z0-9.-]/g, "_")
        const dateStamp = new Date().toISOString().slice(0, 10)
        const filename = `BacklineIT-Weboldal-Novekedesi-Audit-${safeDomain}-${dateStamp}.pdf`

        return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Cache-Control": "no-store",
            },
        })
    } catch (error: any) {
        console.error("Growth audit PDF generation error:", error)
        return NextResponse.json(
            { error: "Hiba történt a PDF jelentés generálása közben." },
            { status: 500 }
        )
    }
}
