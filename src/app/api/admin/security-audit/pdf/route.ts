import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { generateSecurityAuditPdfBuffer } from "@/lib/pdf/security-audit-pdf"
import type { AuditReport } from "@/app/actions/security-audit"

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

        const report = (await req.json()) as AuditReport
        if (!report || !report.domain || !report.technicalDetails) {
            return NextResponse.json(
                { error: "Hiányzó vagy érvénytelen audit jelentés adatok." },
                { status: 400 }
            )
        }

        const pdfBuffer = await generateSecurityAuditPdfBuffer(report)
        const safeDomain = report.domain.replace(/[^a-zA-Z0-9.-]/g, "_")
        const dateStamp = new Date().toISOString().slice(0, 10)
        const filename = `BacklineIT-Biztonsagi-Audit-${safeDomain}-${dateStamp}.pdf`

        return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Cache-Control": "no-store",
            },
        })
    } catch (error: any) {
        console.error("Security audit PDF generation error:", error)
        return NextResponse.json(
            { error: "Hiba történt a PDF jelentés generálása közben." },
            { status: 500 }
        )
    }
}
