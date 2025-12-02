import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email } = body

        const n8nUrl = "https://n8n.backlineit.hu/webhook/newsletter"

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
