import { prisma } from "@/lib/db";

export const generateVerificationToken = async (email: string) => {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

    const existingToken = await prisma.verificationToken.findFirst({
        where: { identifier: email },
    });

    if (existingToken) {
        await prisma.verificationToken.delete({
            where: {
                identifier_token: {
                    identifier: email,
                    token: existingToken.token,
                },
            },
        });
    }

    const verificationToken = await prisma.verificationToken.create({
        data: {
            identifier: email,
            token,
            expires,
        },
    });

    return verificationToken;
};
