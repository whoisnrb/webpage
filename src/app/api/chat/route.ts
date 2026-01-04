import { NextRequest, NextResponse } from "next/server"
import { processChat } from "@/lib/n8n/actions"
import { ALVIN_CONTEXT_HU, ALVIN_CONTEXT_EN } from "@/lib/ai-context"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { message, history, locale } = body

        // Select context based on locale
        const context = locale === 'en' ? ALVIN_CONTEXT_EN : ALVIN_CONTEXT_HU

        // Directly call the internal processing logic
        // We pass the context as part of the body so processChat can potentially use it
        const result = await processChat({
            ...body,
            action: 'chat',
            systemPrompt: context // Injecting the specific context found in route
        })

        const reply = result.output || "Nem kaptam választ az AI-tól."

        return NextResponse.json({ reply })

    } catch (error: any) {
        console.error("Chat local error:", error)
        return NextResponse.json(
            { reply: "Sajnálom, hiba történt a kommunikációban." },
            { status: 500 }
        )
    }
}
