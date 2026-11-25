import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import {
    isBotUserAgent,
    parseDeviceFromUA,
    resolveGeoFromHeaders,
} from "@/lib/live-visitors"

export const runtime = "nodejs"

const ALLOWED_FUNNELS = new Set(["quote", "booking", "consultation"])

export async function POST(req: NextRequest) {
    try {
        const ua = req.headers.get("user-agent") || ""
        if (isBotUserAgent(ua)) {
            return NextResponse.json({ ok: true, skipped: "bot" })
        }

        const body = await req.json().catch(() => null)
        if (!body || typeof body.funnel !== "string" || !ALLOWED_FUNNELS.has(body.funnel) || typeof body.step !== "string") {
            return NextResponse.json({ error: "Invalid funnel payload" }, { status: 400 })
        }

        const rawPage = typeof body.page === "string" ? body.page.slice(0, 200) : "/"
        if (rawPage.startsWith("/admin") || rawPage.startsWith("/api")) {
            return NextResponse.json({ ok: true, skipped: "internal" })
        }

        const geo = resolveGeoFromHeaders(req.headers)
        const device = parseDeviceFromUA(ua)
        const rawHost = req.headers.get("x-forwarded-host") || req.headers.get("host") || ""
        const domain = (typeof body.domain === "string" && body.domain
            ? body.domain
            : rawHost.replace(/:\d+$/, "") || "backlineit.hu"
        ).toLowerCase()

        const visitorId = typeof body.visitorId === "string" ? body.visitorId.slice(0, 64) : "unknown"
        const step = body.step.slice(0, 64)
        const stepNumber = typeof body.stepNumber === "number" ? body.stepNumber : null
        const lastField = typeof body.lastField === "string" ? body.lastField.slice(0, 64) : null

        await prisma.analyticsEvent.create({
            data: {
                name: "funnel_step",
                category: "conversion_funnel",
                properties: {
                    visitorId,
                    domain,
                    funnel: body.funnel,
                    step,
                    stepNumber,
                    lastField,
                    page: rawPage,
                    device,
                    country: geo.countryCode,
                },
            },
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("Funnel analytics error:", error)
        return NextResponse.json({ ok: false }, { status: 500 })
    }
}
