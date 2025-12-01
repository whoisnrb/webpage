import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { message, history } = body

        const webhookUrl = process.env.N8N_CHAT_WEBHOOK_URL
        console.log("[DEBUG] Chat API called");
        console.log(`[DEBUG] N8N_CHAT_WEBHOOK_URL present: ${!!webhookUrl}`);

        if (!webhookUrl) {
            console.error("N8N_CHAT_WEBHOOK_URL is not set")
            return NextResponse.json(
                { reply: "A chat szolgáltatás jelenleg nem elérhető (konfigurációs hiba)." },
                { status: 503 }
            )
        }

        // Forward to n8n
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message,
                history: history.slice(-5) // Send last 5 messages for context
            })
        })

        if (!response.ok) {
            throw new Error(`n8n webhook error: ${response.statusText}`)
        }

        const data = await response.json()

        // Expecting n8n to return { output: "AI response text" } or similar
        // Adjust based on actual n8n workflow response structure
        const reply = data.output || data.text || data.message || "Nem kaptam választ az AI-tól."

        return NextResponse.json({ reply })

    } catch (error) {
        console.error("Chat API error:", error)
        return NextResponse.json(
            { reply: "Sajnálom, hiba történt a kommunikációban." },
            { status: 500 }
        )
    }
}
