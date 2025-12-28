import { NextRequest, NextResponse } from "next/server"
import { getSimplePay } from "@/lib/simplepay"
import { prisma } from "@/lib/db"
import { generateLicenseKey } from "@/lib/license"
import { createInvoice } from "@/lib/szamlazz"
// import { sendTransactionEmail } from "@/lib/email" // nincs használva -> nyugodtan kiveheted

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const signature = request.headers.get("signature") as string

    const simplePay = getSimplePay()

    // 1. Validate IPN signature
    if (!simplePay.validateIPN(body, signature)) {
      console.error("Invalid IPN signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const { orderRef, status } = body as { orderRef: string; status: string }

    // 2. Find order
    const order = await prisma.order.findUnique({
      where: { orderRef },
      include: { user: true, licenses: true },
    })

    if (!order) {
      console.error("Order not found:", orderRef)
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    let licenseKey = order.licenses?.[0]?.key ?? ""

    // 3. Process successful payment
    if (status === "FINISHED") {
      // Update order status if not already success
      if (order.status !== "SUCCESS") {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "SUCCESS" },
        })

        // Generate licenses if not already generated
        if (order.licenses.length === 0 && order.user) {
          // Determine license type based on amount logic (simplified for now)
          let type: "STARTER" | "PRO" = "STARTER"
          if (order.totalAmount >= 400000) type = "PRO"

          licenseKey = await generateLicenseKey()

          // Create a license for the order
          await prisma.license.create({
            data: {
              key: licenseKey,
              type,
              userId: order.user.id,
              orderId: order.id,
              status: "ACTIVE",
            },
          })
        }

        // 4. Generate Invoice
        if (order.user) {
         const invoiceUser = {
  ...order.user,
  name: order.user.name ?? order.user.email ?? "Ismeretlen ügyfél",
  email: order.user.email ?? "",
}


          const invoiceResult = await createInvoice(order, invoiceUser)
          if (!invoiceResult.success) {
            console.error("Invoice generation failed:", invoiceResult.error)
          }
        }

        // Webhook / n8n
        const { sendPurchaseNotification } = await import("@/lib/n8n")

        const fullOrder = await prisma.order.findUnique({
          where: { id: order.id },
          include: {
            items: { include: { product: true } },
            user: true,
          },
        })

        if (fullOrder && fullOrder.user) {
          await sendPurchaseNotification({
            type: "PURCHASE_SUCCESS",
            user: {
              // null-safe, mert nálad ezek lehetnek nullok
              name:
                fullOrder.user.name ??
                fullOrder.user.email ??
                "Ismeretlen ügyfél",
              email: fullOrder.user.email ?? "",
            },
            order: {
              ref: fullOrder.orderRef,
              amount: fullOrder.totalAmount,
              currency: fullOrder.currency,
              date: fullOrder.createdAt.toISOString(),
            },
            products: fullOrder.items.map((item) => ({
              name: item.product.name,
              price: item.price,
            })),
            license: licenseKey
              ? {
                  key: licenseKey,
                  type: order.totalAmount >= 400000 ? "PRO" : "STARTER",
                }
              : undefined,
          })
        }
      }
    }

    // 5. Confirm IPN to SimplePay
    const confirmData = {
      receiveDate: new Date().toISOString(),
    }

    return NextResponse.json(confirmData)
  } catch (error: any) {
    console.error("IPN error:", error)
    return NextResponse.json({ error: "IPN processing failed" }, { status: 500 })
  }
}
