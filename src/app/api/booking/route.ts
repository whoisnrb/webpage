import { NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"
import { processBooking } from "@/lib/n8n/actions"
import { verifyRecaptcha } from "@/lib/recaptcha"

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
        const { recaptchaToken, ...bookingData } = body

        // Verify reCAPTCHA
        if (recaptchaToken) {
            const { success, score } = await verifyRecaptcha(recaptchaToken);
            console.log(`reCAPTCHA verification result: success=${success}, score=${score}`);
            if (!success) {
                return NextResponse.json(
                    { success: false, error: "reCAPTCHA verification failed. Please try again." },
                    { status: 400 }
                )
            }
        } else if (process.env.NODE_ENV === "production") {
            // In production, token is required
            return NextResponse.json(
                { success: false, error: "reCAPTCHA token is missing." },
                { status: 400 }
            )
        }

        // Directly call the internal processing logic
        const result = await processBooking({ ...bookingData, action: 'booking' })

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
