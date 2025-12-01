import { NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"

export async function POST(request: Request) {
    try {
        const headersList = await headers()
        const ip = headersList.get("x-forwarded-for") || "unknown"

        const limiter = rateLimit(ip)

        if (!limiter.success) {
            return NextResponse.json(
                { success: false, error: "Too many requests. Please try again later." },
                { status: 429 }
            },
        body: JSON.stringify({ name, email, date, topic, message })
    })

    if (!response.ok) {
        const errorText = await response.text()
        console.error("n8n returned error:", response.status, response.statusText, errorText)
        const n8nUrl = "https://n8n.backlineit.hu/webhook/booking"
        return NextResponse.json({
            success: false,
            error: `n8n error: ${response.status} ${response.statusText}`,
            details: errorText
        }, { status: 500 })
    }

    return NextResponse.json({ success: true })

} catch (error) {
    console.error("Booking proxy error:", error)
    return NextResponse.json({
        success: false,
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
}
}
