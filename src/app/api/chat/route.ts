import { NextRequest, NextResponse } from "next/server"
import { ALVIN_CONTEXT_HU, ALVIN_CONTEXT_EN } from "@/lib/ai-context"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { message, history, locale } = body

        const webhookUrl = process.env.N8N_UNIFIED_WEBHOOK_URL || "https://n8n.backlineit.hu/webhook/api"

        if (!webhookUrl) {
            console.error("N8N_UNIFIED_WEBHOOK_URL is not set")
            return NextResponse.json(
                { reply: "A chat szolgáltatás jelenleg nem elérhető (konfigurációs hiba)." },
                { status: 503 }
            )
        }

        // Select context based on locale
        // Default to HU if locale is not provided or "en" is not explicitly checked (or logic to default to EN?)
        // The site default is HU, so we default to HU context.
        const context = locale === 'en' ? ALVIN_CONTEXT_EN : ALVIN_CONTEXT_HU

        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message,
                history: history.slice(-5),
                context: context,
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
