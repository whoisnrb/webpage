export async function sendTransactionEmail(
    to: string,
    subject: string,
    body: string,
    attachments: { filename: string; content: string; contentType: string }[] = []
) {
    const webhookUrl = process.env.N8N_EMAIL_WEBHOOK_URL

    if (!webhookUrl) {
        console.warn("N8N_EMAIL_WEBHOOK_URL is not set. Email skipped.")
        return { success: false, error: "Configuration missing" }
    }

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                to,
                subject,
                body,
                attachments
            })
        })

        if (!response.ok) {
            throw new Error(`n8n webhook error: ${response.statusText}`)
        }

        return { success: true }

    } catch (error) {
        console.error("Email sending error:", error)
        return { success: false, error: String(error) }
    }
}
