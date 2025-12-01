const { PrismaClient } = require('@prisma/client')
const { randomBytes } = require('crypto')
const prisma = new PrismaClient()

async function generateLicenseKey() {
    const bytes = randomBytes(8)
    const hex = bytes.toString('hex').toUpperCase()
    const parts = hex.match(/.{1,4}/g)
    return parts?.join('-') || ""
}

async function main() {
    const email = 'whoisnrb@gmail.com'
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
        console.log('User not found')
        return
    }

    const key = await generateLicenseKey()

    const license = await prisma.license.create({
        data: {
            key,
            type: 'PRO',
            userId: user.id,
            status: 'ACTIVE'
        }
    })

    console.log(`Created license ${license.key} for user ${user.email}`)
}

main()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
