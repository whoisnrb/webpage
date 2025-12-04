
export interface PurchasePayload {
    type: "PURCHASE_SUCCESS"
    user: {
        name: string | null
        email: string | null
    }
    order: {
        ref: string
        amount: number
        currency: string
        date: string
    }
    products: {
        name: string
        price: number
    }[]
    license?: {
        key: string
        type: string
    }
}

export async function sendPurchaseNotification(payload: PurchasePayload) {
    const webhookUrl = process.env.N8N_UNIFIED_WEBHOOK_URL || "https://n8n.backlineit.hu/webhook/api"

    if (!webhookUrl) {
        console.warn("N8N_UNIFIED_WEBHOOK_URL is not set. Purchase notification skipped.")
        return { success: false, error: "Configuration missing" }
    }

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...payload,
                action: "purchase"
            })
        })

        if (!response.ok) {
            throw new Error(`n8n webhook error: ${response.statusText}`)
        }

        return { success: true }

    } catch (error) {
        console.error("Purchase notification error:", error)
        return { success: false, error: String(error) }
    }
}
