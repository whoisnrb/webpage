import Stripe from "stripe"
const szamlazz = require('szamlazz.js')

export async function createInvoice(session: Stripe.Checkout.Session) {
    if (!process.env.SZAMLAZZHU_API_KEY) {
        throw new Error("Missing SZAMLAZZHU_API_KEY environment variable. Cannot generate invoice.")
    }

    const customer = session.customer_details
    if (!customer || !customer.name || !customer.email || !customer.address) {
        throw new Error("Missing customer details from Stripe session.")
    }

    // Initialize Számla Agent Client
    const szamlaAgent = new szamlazz.Client({
        authToken: process.env.SZAMLAZZHU_API_KEY,
        eInvoice: true, // Generate e-invoice
        requestInvoiceDownload: false, // We just want to issue it and let Számlázz.hu email it
    })

    // Setup Buyer based on Stripe Checkout data
    const buyer = new szamlazz.Buyer({
        name: customer.name,
        country: customer.address.country || 'HU',
        zip: customer.address.postal_code || '',
        city: customer.address.city || '',
        address: `${customer.address.line1 || ''} ${customer.address.line2 || ''}`.trim(),
        email: customer.email,
        sendEmail: true, // Tell Számlázz.hu to email the invoice directly to the buyer
    })

    // Prepare Invoice Item based on Stripe Line Items
    // Since we didn't fetch line items, we can use the total amount and metadata for simplicity,
    // or we'd need to fetch line items from Stripe API: const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
    
    const serviceName = session.metadata?.serviceName || "IT Szolgáltatás"
    const amountInHuf = session.amount_total ? session.amount_total : 0 // Since HUF is zero decimal, amount_total is exactly HUF. If it was EUR, it would be cents.

    // AAM (Alanyi Adómentes) or 27% VAT. Assuming Alanyi Adómentes for individual entrepreneur by default, but this should be configurable.
    const item = new szamlazz.Item({
        label: serviceName,
        quantity: 1,
        unit: 'db',
        vat: 'AAM', // "Alanyi Adómentes". Change to '27' if VAT registered.
        netUnitPrice: amountInHuf, // For AAM, net = gross
    })

    const invoice = new szamlazz.Invoice({
        paymentMethod: szamlazz.PaymentMethod.Stripe,
        currency: szamlazz.Currency.Ft,
        language: szamlazz.Language.Hungarian,
        invoiceIdPrefix: 'WEB', // Prefix for web orders
        paid: true, // Since they paid via Stripe
    })

    invoice.add(item)

    // Issue the invoice
    try {
        const result = await szamlaAgent.issueInvoice(invoice)
        console.log("Successfully generated Számlázz.hu invoice:", result.invoiceId)
        return result
    } catch (error) {
        console.error("Számlázz.hu API Error:", error)
        throw error
    }
}
