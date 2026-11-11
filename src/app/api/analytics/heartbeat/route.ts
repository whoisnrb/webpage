import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import {
    isBotUserAgent,
    parseDeviceFromUA,
    removeLiveVisitor,
    resolveGeoFromHeaders,
    upsertLiveVisitor,
} from "@/lib/live-visitors"

export const runtime = "nodejs"

function formatReferrerLabel(rawReferrer: string): string {
    if (!rawReferrer) return "Közvetlen (Direct)"
    const lower = rawReferrer.toLowerCase()
    if (lower.includes("backlineit.hu") || lower.includes("localhost")) {
        return "Közvetlen (Direct)"
    }
    if (lower.includes("google.")) return "Google Keresés"
    if (lower.includes("bing.")) return "Bing Keresés"
    if (lower.includes("linkedin.")) return "LinkedIn"
    if (lower.includes("facebook.") || lower.includes("fb.com") || lower.includes("l.facebook")) return "Facebook"
    if (lower.includes("instagram.")) return "Instagram"
    if (lower.includes("tiktok.")) return "TikTok"
    if (lower.includes("github.")) return "GitHub"
    try {
        const host = new URL(rawReferrer).hostname.replace(/^www\./, "")
        return host || "Külső hivatkozás"
    } catch {
        return "Külső hivatkozás"
    }
}

export async function POST(req: NextRequest) {
    try {
        const ua = req.headers.get("user-agent") || ""
        if (isBotUserAgent(ua)) {
            return NextResponse.json({ ok: true, skipped: "bot" })
        }

        const body = await req.json().catch(() => null)
        if (!body || typeof body.visitorId !== "string" || !body.visitorId) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
        }

        const visitorId = body.visitorId.slice(0, 64)
        if (body.leaving) {
            await removeLiveVisitor(visitorId)
            return NextResponse.json({ ok: true, removed: true })
        }

        const rawPage = typeof body.page === "string" ? body.page.slice(0, 200) : "/"
        if (rawPage.startsWith("/admin") || rawPage.startsWith("/api")) {
            return NextResponse.json({ ok: true, skipped: "internal" })
        }

        const now = Date.now()
        const maxSessionAgeMs = 4 * 60 * 60 * 1000
        let startedAt = typeof body.startedAt === "number" ? body.startedAt : now
        if (!Number.isFinite(startedAt) || startedAt > now || now - startedAt > maxSessionAgeMs) {
            startedAt = now
        }

        const geo = resolveGeoFromHeaders(req.headers)
        const device = parseDeviceFromUA(ua)
        const referrer = formatReferrerLabel(typeof body.referrer === "string" ? body.referrer : "")

        await upsertLiveVisitor({
            id: visitorId,
            city: geo.city,
            country: geo.country,
            countryCode: geo.countryCode,
            flag: geo.flag,
            lat: geo.lat,
            lng: geo.lng,
            page: rawPage,
            device,
            referrer,
            startedAt,
            lastSeenAt: now,
        })

        if (body.isPageView === true) {
            prisma.analyticsEvent
                .create({
                    data: {
                        name: "page_view",
                        category: "navigation",
                        properties: {
                            page: rawPage,
                            country: geo.countryCode,
                            city: geo.city,
                            device,
                            referrer,
                        },
                    },
                })
                .catch(() => {})
        }

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error("Heartbeat error:", error)
        return NextResponse.json({ ok: false }, { status: 500 })
    }
}
