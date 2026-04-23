
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tables = ['BlogPost', 'Project', 'Reference', 'Service', 'Lead', 'Consultation'];
  for (const table of tables) {
    const count = await prisma[table[0].toLowerCase() + table.slice(1)].count();
    const latest = await prisma[table[0].toLowerCase() + table.slice(1)].findFirst({
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true }
    });
    console.log(`${table}: ${count} total, latest: ${latest ? latest.createdAt : 'none'}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
