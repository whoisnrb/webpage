"use server"

import Stripe from "stripe"
import { headers } from "next/headers"

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable")
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20" as any,
})

export async function createCheckoutSession(params: {
    serviceName: string,
    price: number,
    currency: string,
    description?: string,
    successUrl?: string,
    cancelUrl?: string
}) {
    try {
        const headersList = await headers()
        const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

        // Helper to handle zero-decimal currencies
        const zeroDecimalCurrencies = ['bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf', 'huf']
        const isZeroDecimal = zeroDecimalCurrencies.includes(params.currency.toLowerCase())
        const unitAmount = isZeroDecimal ? Math.round(params.price) : Math.round(params.price * 100)

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            billing_address_collection: "required", // Required for Számlázz.hu
            line_items: [
                {
                    price_data: {
                        currency: params.currency.toLowerCase(),
                        product_data: {
                            name: params.serviceName,
                            description: params.description,
                        },
                        unit_amount: unitAmount,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: params.successUrl ? `${origin}${params.successUrl}` : `${origin}/megoldasok?success=true`,
            cancel_url: params.cancelUrl ? `${origin}${params.cancelUrl}` : `${origin}/megoldasok?canceled=true`,
            metadata: {
                serviceName: params.serviceName,
            }
        })

        return { url: session.url }
    } catch (error: any) {
        console.error("Stripe Checkout Error:", error)
        return { error: error.message }
    }
}
