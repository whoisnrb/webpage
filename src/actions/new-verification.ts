"use server";

import { prisma } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getTranslations } from "next-intl/server";

export const newVerification = async (token: string) => {
    const t = await getTranslations("Auth.Server");
    const existingToken = await prisma.verificationToken.findFirst({
        where: { token },
    });

    if (!existingToken) {
        return { error: t("token_invalid") };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: t("token_expired") };
    }

    const existingUser = await getUserByEmail(existingToken.identifier);

    if (!existingUser) {
        return { error: t("user_not_found") };
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

    return { success: t("email_verified") };
};
