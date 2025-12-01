import { NextRequest, NextResponse } from 'next/server'
import { getSimplePay } from '@/lib/simplepay'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { packageName, amount, customerEmail, customerName, paymentMethod = 'SIMPLEPAY' } = body

        if (!packageName || !amount || !customerEmail) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const simplePay = getSimplePay()
        const orderRef = simplePay.generateOrderRef()

        // Save order to database
        try {
            // Ensure user exists
            await prisma.user.upsert({
                where: { email: customerEmail },
                update: { name: customerName },
                create: {
                    email: customerEmail,
                    name: customerName,
                },
            })

            // Create order
            await prisma.order.create({
                data: {
                    orderRef,
                    totalAmount: parseInt(amount),
                    currency: 'HUF',
                    customerEmail,
                    customerName,
                    status: paymentMethod === 'SIMPLEPAY' ? 'PENDING' : 'PENDING_PAYMENT',
                    paymentMethod,
                },
            })
        } catch (dbError) {
            console.error('Database error:', dbError)
            return NextResponse.json(
                { error: 'Failed to create order record' },
                { status: 500 }
            )
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

        // Handle Manual Payments
        if (paymentMethod === 'TRANSFER' || paymentMethod === 'PAYPAL') {
            return NextResponse.json({
                success: true,
                paymentUrl: `${baseUrl}/payment/instructions?orderRef=${orderRef}&method=${paymentMethod}`,
                orderRef: orderRef,
            })
        }

        const paymentData = {
            orderRef,
            amount: parseInt(amount),
            currency: 'HUF',
            customerEmail,
            customerName,
            language: 'HU',
            methods: ['CARD'],
            successUrl: `${baseUrl}/payment/success?orderRef=${orderRef}`,
            failUrl: `${baseUrl}/payment/fail?orderRef=${orderRef}`,
            cancelUrl: `${baseUrl}/payment/cancel?orderRef=${orderRef}`,
            backUrl: `${baseUrl}/checkout?package=${packageName}`,
        }

        console.log('Sending payment to SimplePay:', {
            ...paymentData,
            // Mask sensitive data in logs
            merchant: '***',
            salt: '***'
        })

        const result = await simplePay.startPayment(paymentData)

        if (result.paymentUrl) {
            return NextResponse.json({
                success: true,
                paymentUrl: result.paymentUrl,
                orderRef: orderRef,
                transactionId: result.transactionId,
            })
        } else {
            return NextResponse.json(
                { error: 'Failed to start payment', details: result },
                { status: 500 }
            )
        }
    } catch (error: any) {
        console.error('Payment start error:', error)
        return NextResponse.json(
            { error: 'Internal server error', message: error.message },
            { status: 500 }
        )
    }
}
