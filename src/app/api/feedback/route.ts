import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, feedback } = body

        // The n8n Webhook URL provided by the user (Production)
        const n8nUrl = "https://undefied-collette-unharping.ngrok-free.dev/webhook/Feedback"

        // Construct the payload matching the n8n Webhook expectations
        const payload = {
            "Név": name,
            "Name": name,
            "Email": email,
            "Vélemény": feedback,
            "Feedback": feedback
        }

        const response = await fetch(n8nUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
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
