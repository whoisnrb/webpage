import { NextResponse } from "next/server"
import { processFeedback } from "@/lib/n8n/actions"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, feedback, locale, rating } = body
        const host = request.headers.get("host") || ""
        const resolvedLocale = locale === "en" || host.includes("backlineit.com") ? "en" : "hu"
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

        if (!name?.trim() || !emailRegex.test(email?.trim() || "") || !feedback?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    error: resolvedLocale === "en"
                        ? "Please provide your name, a valid email address, and your feedback."
                        : "Kérjük, adj meg nevet, érvényes e-mail címet és véleményt."
                },
                { status: 400 }
            )
        }

        await processFeedback({
            name: name.trim(),
            email: email.trim(),
            feedback: feedback.trim(),
            locale: resolvedLocale,
            rating: typeof rating === "number" ? rating : undefined,
            action: 'feedback'
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error("Feedback error:", error)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}
