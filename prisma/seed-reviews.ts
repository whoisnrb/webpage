import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const reviews = [
        {
            name: "Kovács Gábor",
            content: "Nagyon elégedett vagyok az automatizációval. Rengeteg időt spórolunk vele naponta.",
            rating: 5,
            locale: "hu",
            approved: true,
            createdAt: new Date('2024-01-10')
        },
        {
            name: "Nagy Anita",
            content: "A weboldalunk sokkal gyorsabb lett a fejlesztés után. Proaktív és segítőkész csapat.",
            rating: 5,
            locale: "hu",
            approved: true,
            createdAt: new Date('2024-01-08')
        },
        {
            name: "John Doe",
            content: "Excellent service and professional approach. The AI integration was seamless.",
            rating: 5,
            locale: "en",
            approved: true,
            createdAt: new Date('2024-01-05')
        },
        {
            name: "Tóth Barnabás",
            content: "Kiváló szakértelem, pontos munkavégzés. Mindenkinek ajánlom!",
            rating: 4,
            locale: "hu",
            approved: true,
            createdAt: new Date('2024-01-02')
        },
        {
            name: "Sarah Miller",
            content: "They helped us automate our entire billing process. Life changer!",
            rating: 5,
            locale: "en",
            approved: true,
            createdAt: new Date('2023-12-28')
        }
    ]

    console.log('Seeding reviews...')
    for (const review of reviews) {
        await prisma.review.create({
            data: review
        })
    }
    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
