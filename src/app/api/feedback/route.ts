import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, feedback } = body

        const n8nUrl = process.env.N8N_UNIFIED_WEBHOOK_URL || "https://n8n.backlineit.hu/webhook/api"

        const response = await fetch(n8nUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                feedback,
                action: "feedback"
            })
        })

        if (!response.ok) {
            console.error("n8n returned error:", response.status, response.statusText)
            return NextResponse.json({ success: false, error: "Failed to send to n8n" }, { status: 500 })
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error("Proxy error:", error)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}
