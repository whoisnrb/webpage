
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const slug = 'how-to-save-time-with-automation';
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { series: true }
  });
  
  if (post) {
    console.log('Post found:');
    console.log(`Title: ${post.title}`);
    console.log(`Published: ${post.published}`);
    console.log(`Content length: ${post.content.length}`);
  } else {
    console.log(`Post with slug "${slug}" NOT found.`);
    const all = await prisma.blogPost.findMany({ select: { slug: true } });
    console.log('Available slugs:', all.map(p => p.slug));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
