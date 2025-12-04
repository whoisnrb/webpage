import { NextRequest, NextResponse } from "next/server"
import { ALVIN_CONTEXT } from "@/lib/ai-context"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { message, history } = body

        const webhookUrl = process.env.N8N_UNIFIED_WEBHOOK_URL || "https://n8n.backlineit.hu/webhook/api"

        if (!webhookUrl) {
            console.error("N8N_UNIFIED_WEBHOOK_URL is not set")
            return NextResponse.json(
                { reply: "A chat szolgáltatás jelenleg nem elérhető (konfigurációs hiba)." },
                { status: 503 }
            )
        }

        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message,
                history: history.slice(-5),
                context: ALVIN_CONTEXT,
                action: "chat"
            })
        })

        if (!response.ok) {
            throw new Error(`n8n webhook error: ${response.statusText}`)
        }

        const data = await response.json()
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
