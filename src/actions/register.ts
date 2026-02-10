"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import { prisma } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    console.log("Register action called with:", values);
    const t = await getTranslations("Auth.Server");
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: t("invalid_fields") };
    }

    try {
        const { email, password, name } = validatedFields.data;
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return { error: t("email_taken") };
        }

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        const verificationToken = await generateVerificationToken(email);
        await sendVerificationEmail(verificationToken.identifier, verificationToken.token);

        // Sync to CRM via n8n
        try {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const webhookUrl = process.env.N8N_UNIFIED_WEBHOOK_URL || `${baseUrl}/api/unified`;
            await fetch(webhookUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "crm_sync",
                    name,
                    email,
                    source: "registration"
                })
            });
        } catch (crmError) {
            console.error("CRM Sync Error:", crmError);
        }

        return { success: t("verification_sent") };
    } catch (error) {
        console.error("REGISTRATION ERROR:", error);
        return { error: t("registration_error") };
    }
};
