import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-12-18.acacia",
    typescript: true,
})

export async function createCheckoutSession({
    priceId,
    userId,
    userEmail,
}: {
    priceId: string
    userId: string
    userEmail: string
}) {
    const session = await stripe.checkout.sessions.create({
        customer_email: userEmail,
        client_reference_id: userId,
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
        subscription_data: {
            metadata: {
                userId,
            },
        },
    })

    return session
}

export async function createCustomerPortalSession({
    customerId,
}: {
    customerId: string
}) {
    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    })

    return session
}

export async function getSubscription(userId: string) {
    const subscription = await prisma.subscription.findUnique({
        where: { userId },
    })

    if (!subscription || !subscription.stripeSubscriptionId) {
        return null
    }

    try {
        const stripeSubscription = await stripe.subscriptions.retrieve(
            subscription.stripeSubscriptionId
        )

        return {
            ...subscription,
            stripeSubscription,
        }
    } catch (error) {
        console.error("Error fetching Stripe subscription:", error)
        return null
    }
}
