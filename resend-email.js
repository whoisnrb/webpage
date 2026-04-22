const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');
const crypto = require('crypto');
const { sendAccountCreatedEmail } = require('./src/lib/mail');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    const email = 'norbi1071@yahoo.com';
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
        console.log("User not found");
        return;
    }

    const generatedPassword = crypto.randomBytes(6).toString('hex');
    const hashedPassword = await hash(generatedPassword, 10);

    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
    });

    console.log(`Password reset for ${email}. Sending email...`);
    await sendAccountCreatedEmail(email, user.name, generatedPassword, "Webfejlesztés - Webáruház");
    console.log("Done");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
