const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Checking recent blog posts...')
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      createdAt: true
    }
  })
  console.log(JSON.stringify(posts, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
