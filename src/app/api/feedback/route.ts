import { NextResponse } from "next/server"
import { processFeedback } from "@/lib/n8n/actions"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, feedback } = body

        await processFeedback({ 
            name, 
            email, 
            feedback, 
            action: 'feedback' 
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error("Feedback error:", error)
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
    }
}
