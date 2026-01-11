import { NextResponse } from "next/server"
import { processNewsletter } from "@/lib/n8n/actions"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email } = body
        console.log(`[Newsletter API] Attempting subscription for: ${email}`)

        const result = await processNewsletter({ email, action: 'newsletter' })
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
