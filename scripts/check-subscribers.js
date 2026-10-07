const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    const leads = await prisma.lead.findMany();
    console.log('LEADS_COUNT:', leads.length);
    console.log('LEADS:', JSON.stringify(leads, null, 2));

    const contacts = await prisma.contactMessage.findMany();
    console.log('CONTACTS_COUNT:', contacts.length);
    console.log('CONTACTS:', JSON.stringify(contacts, null, 2));

    const consultations = await prisma.consultation.findMany();
    console.log('CONSULTATIONS_COUNT:', consultations.length);
}

run()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
