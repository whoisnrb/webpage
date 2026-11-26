import { NextResponse } from "next/server"
import { processNewsletter } from "@/lib/n8n/actions"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, locale: bodyLocale } = body
        const host = request.headers.get("host") || ""
        const referer = request.headers.get("referer") || ""
        const locale = bodyLocale === "en" || host.includes("backlineit.com") || referer.includes("backlineit.com")
            ? "en"
            : "hu"
        console.log(`[Newsletter API] Attempting subscription for: ${email} (${locale})`)

        const result = await processNewsletter({ email, locale, action: 'newsletter' })
        console.log(`[Newsletter API] Success:`, result)

        return NextResponse.json(result)

    } catch (error: any) {
        console.error("!!! Newsletter API Error !!!")
        console.error("- Message:", error.message)
        console.error("- Code:", error.code)
        console.error("- Stack:", error.stack)

        return NextResponse.json({
            success: false,
            error: error.message,
            code: error.code
        }, { status: 500 })
    }
}
