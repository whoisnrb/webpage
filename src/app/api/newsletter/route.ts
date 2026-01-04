import { NextResponse } from "next/server"
import { processNewsletter } from "@/lib/n8n/actions"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email } = body

        const result = await processNewsletter({ email, action: 'newsletter' })

        return NextResponse.json(result)

    } catch (error: any) {
        console.error("Newsletter error:", error)
        // Visszaküldjük a pontos hibát, hogy lássuk mi történik
        return NextResponse.json({ 
            success: false, 
            error: error.message,
            details: error.response?.data || "No extra details"
        }, { status: 500 })
    }
}
