import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { createInvoice } from "@/lib/szamlazz"
import { prisma } from "@/lib/db"
import { sendAccountCreatedEmail } from "@/lib/mail"
import { hash } from "bcryptjs"
import crypto from "crypto"

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

            // Save payment to database so it appears in Admin Inquiries panel
            if (session.customer_details) {
                const email = session.customer_details.email || 'ismeretlen@email.com';
                const name = session.customer_details.name || 'Ismeretlen Vásárló';
                const serviceName = session.metadata?.serviceName || 'Stripe Checkout';

                await prisma.serviceInquiry.create({
                    data: {
                        name: name,
                        email: email,
                        serviceType: serviceName,
                        description: 'Automatikus Stripe fizetés',
                        status: 'PAID',
                        budget: session.amount_total ? `${session.amount_total / 100} Ft` : 'N/A',
                        company: session.customer_details.address?.line1 || null,
                        phone: session.customer_details.phone || null
                    }
                })
                console.log(`Saved ServiceInquiry to database for session ${session.id}`)

                // Create User and Project if not exists
                if (email !== 'ismeretlen@email.com') {
                    let user = await prisma.user.findUnique({ where: { email } });
                    let isNewUser = false;
                    let generatedPassword = "";

                    if (!user) {
                        generatedPassword = crypto.randomBytes(6).toString('hex'); // 12 chars
                        const hashedPassword = await hash(generatedPassword, 10);
                        
                        user = await prisma.user.create({
                            data: {
                                email,
                                name,
                                password: hashedPassword,
                                role: "USER",
                            }
                        });
                        isNewUser = true;
                    }

                    // Create project
                    await prisma.project.create({
                        data: {
                            title: serviceName,
                            description: `Automatikus projekt létrehozás Stripe fizetés után.`,
                            status: "KICKOFF",
                            userId: user.id,
                            serviceType: serviceName,
                        }
                    });
                    console.log(`Created project for user ${email}`);

                    if (isNewUser) {
                        await sendAccountCreatedEmail(email, name, generatedPassword, serviceName);
                    }
                }
            }
        } catch (error) {
            console.error("Error processing successful checkout:", error)
            return NextResponse.json({ error: "Error processing checkout" }, { status: 500 })
        }
    }

    return NextResponse.json({ received: true }, { status: 200 })
}
