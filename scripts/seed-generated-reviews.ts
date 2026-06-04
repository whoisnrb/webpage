import { PrismaClient } from '@prisma/client'
import { reviews } from '../src/data/reviews'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding reviews...')
  
  for (const review of reviews) {
    // Check if it already exists by some unique attribute, or just insert
    // We will just insert them. We can use the date from the review object
    await prisma.review.create({
      data: {
        name: review.name,
        // email is optional, we don't have it
        rating: review.rating,
        content: review.content,
        // the reviews.ts has "locale" implicitly as Hungarian or English, we can just use "hu" mostly
        locale: review.content.includes('the') ? 'en' : 'hu',
        approved: true, // we want them visible
        createdAt: new Date(review.date),
      }
    })
  }

  console.log('Reviews seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
