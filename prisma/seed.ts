import { PrismaClient } from '@prisma/client'
// Note: We use child_process to run other seed files to avoid complex imports in ts-node
import { execSync } from 'child_process'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting master seed...')

    const seeds = [
        'prisma/seed-products.ts',
        'prisma/seed-blog.ts',
        'prisma/seed-metrics.ts',
        'prisma/seed-cron.ts',
        'prisma/seed-reviews.ts'
    ]

    for (const seed of seeds) {
        console.log(`Running seed: ${seed}`)
        try {
            execSync(`npx ts-node --compiler-options "{\\\"module\\\":\\\"CommonJS\\\"}" ${seed}`, { stdio: 'inherit' })
        } catch (error) {
            console.error(`Error running seed ${seed}:`, error)
        }
    }

    console.log('Master seed finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
