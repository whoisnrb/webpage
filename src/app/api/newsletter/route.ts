import { NextResponse } from "next/server"
import { processNewsletter } from "@/lib/n8n/actions"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email } = body

        await processNewsletter({ email, action: 'newsletter' })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error("Newsletter error:", error)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}
