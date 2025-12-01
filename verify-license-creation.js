const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const orderRef = 'TEST-E6A825CB'

    const order = await prisma.order.findUnique({
        where: { orderRef },
        include: { licenses: true }
    })

    if (!order) {
        console.log('Order not found!')
        return
    }

    console.log(`Order Status: ${order.status}`)
    if (order.licenses.length > 0) {
        console.log('SUCCESS: License created!')
        console.log(`License Key: ${order.licenses[0].key}`)
        console.log(`License Type: ${order.licenses[0].type}`)
    } else {
        console.log('FAILURE: No license created.')
    }
}

main()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
