
// Using global fetch available in Node.js 18+

async function testWebhook() {
    const webhookUrl = "https://undefied-collette-unharping.ngrok-free.dev/webhook-test/purchase-webhook";

    const payload = {
        type: "PURCHASE_SUCCESS",
        user: {
            name: "Teszt Elek",
            email: "teszt@example.com" // The user should see this in their n8n
        },
        order: {
            ref: "ORDER-TEST-12345",
            amount: 45000,
            currency: "HUF",
            date: new Date().toISOString()
        },
        products: [
            {
                name: "Next.js SaaS Boilerplate",
                price: 45000
            }
        ],
        license: {
            key: "TEST-LICENSE-KEY-XXXX-YYYY",
            type: "PRO"
        }
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

testWebhook();
