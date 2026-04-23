
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const series = await prisma.blogSeries.count();
  const latest = await prisma.blogSeries.findFirst({ orderBy: { createdAt: 'desc' } });
  console.log(`Series count: ${series}`);
  if (latest) console.log(`Latest series: ${latest.title} (${latest.createdAt})`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
