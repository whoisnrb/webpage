import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { createInvoice } from "@/lib/szamlazz"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20" as any,
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
    if (!webhookSecret) {
        console.error("Missing STRIPE_WEBHOOK_SECRET")
        return NextResponse.json({ error: "Missing Webhook Secret" }, { status: 500 })
    }

    const body = await req.text()
    const signature = (await headers()).get("stripe-signature")

    if (!signature) {
        return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
        console.error(`⚠️  Webhook signature verification failed:`, err.message)
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session
        
        try {
            console.log(`Payment successful for session ${session.id}`)
            
            // Generate invoice with Számlázz.hu
            if (session.customer_details) {
                 await createInvoice(session)
            } else {
                 console.warn("No customer details found in session, skipping invoice generation.")
            }

            // TODO: Update database order status if we stored it

        } catch (error) {
            console.error("Error processing successful checkout:", error)
            return NextResponse.json({ error: "Error processing checkout" }, { status: 500 })
        }
    }

    return NextResponse.json({ received: true }, { status: 200 })
}
