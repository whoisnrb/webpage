import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email } = body

        if (!email) {
            return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
        }

        // The n8n Webhook URL provided by the user (Production)
        const n8nUrl = "https://undefied-collette-unharping.ngrok-free.dev/webhook/newsletter"

        const response = await fetch(n8nUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ email })
        })

        if (!response.ok) {
            console.error("n8n returned error:", response.status, response.statusText)
            return NextResponse.json({ success: false, error: "Failed to subscribe" }, { status: 500 })
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error("Newsletter proxy error:", error)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}
