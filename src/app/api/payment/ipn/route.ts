import { NextRequest, NextResponse } from 'next/server'
import { getSimplePay } from '@/lib/simplepay'
import { prisma } from '@/lib/db'
import { generateLicenseKey } from '@/lib/license'
import { createInvoice } from '@/lib/szamlazz'
import { sendTransactionEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const signature = request.headers.get('signature') as string

        const simplePay = getSimplePay()

        // 1. Validate IPN signature
        if (!simplePay.validateIPN(body, signature)) {
            console.error('Invalid IPN signature')
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
        }

        const { orderRef, status } = body

        // 2. Find order
        const order = await prisma.order.findUnique({
            where: { orderRef },
            include: { user: true, licenses: true }
        })

        if (!order) {
            console.error('Order not found:', orderRef)
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        // 3. Process successful payment
        if (status === 'FINISHED') {
            // Update order status if not already success
            if (order.status !== 'SUCCESS') {
                await prisma.order.update({
                    where: { id: order.id },
                    data: { status: 'SUCCESS' }
                })

                // Generate licenses if not already generated
                let licenseKey = ""
                if (order.licenses.length === 0 && order.user) {
                    // Determine license type based on amount logic (simplified for now)
                    let type = 'STARTER'
                    if (order.totalAmount >= 400000) type = 'PRO'

                    licenseKey = await generateLicenseKey()

                    // Create a license for the order
                    await prisma.license.create({
                        data: {
                            key: licenseKey,
                            type,
                            userId: order.user.id,
                            orderId: order.id,
                            status: 'ACTIVE'
                        }
                    })
                } else if (order.licenses.length > 0) {
                    licenseKey = order.licenses[0].key
                }

                // 4. Generate Invoice & Send Webhook Notification
                if (order.user) {
                    // Create Invoice (Keep this as is for now, or move to n8n too if desired later)
                    const invoiceResult = await createInvoice(order, order.user)
                    if (!invoiceResult.success) {
                        console.error("Invoice generation failed:", invoiceResult.error)
                    }

                    // Prepare payload for n8n
                    const { sendPurchaseNotification } = await import('@/lib/n8n')

                    // Fetch full order details with items if not already available
                    // (The initial query included 'items' but we need to be sure)
                    const fullOrder = await prisma.order.findUnique({
                        where: { id: order.id },
                        include: {
                            items: { include: { product: true } },
                            user: true
                        }
                    })

                    if (fullOrder && fullOrder.user) {
                        await sendPurchaseNotification({
                            type: "PURCHASE_SUCCESS",
                            user: {
                                name: fullOrder.user.name,
                                email: fullOrder.user.email
                            },
                            order: {
                                ref: fullOrder.orderRef,
                                amount: fullOrder.totalAmount,
                                currency: fullOrder.currency,
                                date: fullOrder.createdAt.toISOString()
                            },
                            products: fullOrder.items.map(item => ({
                                name: item.product.name,
                                price: item.price
                            })),
                            license: licenseKey ? {
                                key: licenseKey,
                                type: order.totalAmount >= 400000 ? 'PRO' : 'STARTER' // Simplified logic, should match generation
                            } : undefined
                        })
                    }
                }
            }
        }

        // 5. Confirm IPN to SimplePay
        const confirmDate = new Date().toISOString()
        const confirmData = {
            receiveDate: confirmDate
        }

        return NextResponse.json(confirmData)

    } catch (error: any) {
        console.error('IPN error:', error)
        return NextResponse.json(
            { error: 'IPN processing failed' },
            { status: 500 }
        )
    }
}
