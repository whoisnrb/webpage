
// Using global fetch available in Node.js 18+

async function testVerificationWebhook() {
    // Read from .env if possible, but for this standalone script we'll hardcode the one we just set
    // to verify connectivity first.
    const webhookUrl = "https://undefied-collette-unharping.ngrok-free.dev/webhook-test/verification";

    const payload = {
        email: "test-verification@example.com",
        token: "123456",
        type: "verification"
    };

    console.log("Sending test payload to:", webhookUrl);
    console.log(JSON.stringify(payload, null, 2));

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log("✅ Webhook successfully triggered!");
            console.log("Response status:", response.status);
        } else {
            console.error("❌ Webhook failed!");
            console.error("Response status:", response.status);
            console.error("Response text:", await response.text());
        }
    } catch (error) {
        console.error("❌ Error sending webhook:", error);
    }
}

testVerificationWebhook();
