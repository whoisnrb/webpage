import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const body = await request.json()
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
