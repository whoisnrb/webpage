export const sendVerificationEmail = async (email: string, token: string) => {
    // Forcing test URL for debugging
    const webhookUrl = "https://n8n.backlineit.hu/webhook-test/api"; // process.env.N8N_UNIFIED_WEBHOOK_URL || "https://n8n.backlineit.hu/webhook/api";
    console.log("[DEBUG] sendVerificationEmail called");
    console.log(`[DEBUG] N8N_UNIFIED_WEBHOOK_URL present: ${!!webhookUrl}`);
    console.log(`[DEBUG] N8N_UNIFIED_WEBHOOK_URL value: ${webhookUrl}`);

    if (!webhookUrl) {
        console.warn("N8N_UNIFIED_WEBHOOK_URL is not set. Verification email will not be sent.");
        console.log(`[DEV] Verification code for ${email}: ${token}`);
        return;
    }

    try {
        // Append token and action to URL query params as a fallback
        const urlWithParams = `${webhookUrl}?action=verification&token=${token}`;
        const response = await fetch(urlWithParams, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                token,
                action: "verification",
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to send email: ${response.statusText}`);
        }

        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error("Error sending verification email:", error);
        // In dev, log the token so we can still verify
        console.log(`[FALLBACK] Verification code for ${email}: ${token}`);
    }
};
