const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const email = 'whoisnrb@gmail.com'
    const user = await prisma.user.update({
        where: { email: email },
        data: { role: 'ADMIN' },
    })
    console.log(`User ${user.email} promoted to ${user.role}`)
}

main()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
