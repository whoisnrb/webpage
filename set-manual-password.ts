import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'norbi1071@yahoo.com';
    const newPassword = 'Backline2026!'; // Temporary password
    const hashedPassword = await hash(newPassword, 10);

    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
    });

    console.log(`Password reset for ${email} to ${newPassword}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
