import { NextResponse } from "next/server"
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
