import { NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"
import { processBooking } from "@/lib/n8n/actions"

export async function POST(request: Request) {
    try {
        const headersList = await headers()
        const ip = headersList.get("x-forwarded-for") || "unknown"

        const limiter = rateLimit(ip)

        if (!limiter.success) {
            return NextResponse.json(
                { success: false, error: "Too many requests. Please try again later." },
                { status: 429 }
            )
        }

        const body = await request.json()

        // Directly call the internal processing logic
        const result = await processBooking({ ...body, action: 'booking' })

        return NextResponse.json(result)

    } catch (error: any) {
        console.error("Booking local error:", error)
        return NextResponse.json({
            success: false,
            error: error.message || "Internal Server Error",
            details: error.response?.data || "No extra details"
        }, { status: 500 })
    }
}
