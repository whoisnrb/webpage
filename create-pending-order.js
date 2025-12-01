const { PrismaClient } = require('@prisma/client')
const { randomBytes } = require('crypto')
const prisma = new PrismaClient()

async function main() {
    const email = 'whoisnrb@gmail.com'
    const orderRef = 'TEST-' + randomBytes(4).toString('hex').toUpperCase()

    const order = await prisma.order.create({
        data: {
            orderRef,
            amount: 199000, // Starter package price
            currency: 'HUF',
            customerEmail: email,
            customerName: 'Test User',
            status: 'PENDING'
        }
    })

    console.log(`Created pending order: ${orderRef}`)
    console.log(`Visit: http://localhost:3000/payment/success?orderRef=${orderRef}`)
}

main()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
