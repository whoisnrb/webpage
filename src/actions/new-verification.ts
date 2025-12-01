"use server";

import { prisma } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const newVerification = async (token: string) => {
    const existingToken = await prisma.verificationToken.findFirst({
        where: { token },
    });

    if (!existingToken) {
        return { error: "A kód nem létezik vagy lejárt!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "A kód lejárt!" };
    }

    const existingUser = await getUserByEmail(existingToken.identifier);

    if (!existingUser) {
        return { error: "A felhasználó nem található!" };
    }

    await prisma.user.update({
        where: { id: existingUser.id },
        data: {
            emailVerified: new Date(),
            email: existingToken.identifier, // Update email if needed (e.g. change email flow)
        },
    });

    await prisma.verificationToken.delete({
        where: {
            token: existingToken.token,
        },
    });

    return { success: "Email sikeresen megerősítve!" };
};
