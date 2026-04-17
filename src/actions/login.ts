"use server";

import * as z from "zod";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { getTranslations } from "next-intl/server";
import { trackEvent } from "@/lib/analytics";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const t = await getTranslations("Auth.Server");
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: t("invalid_fields") };
    }

    const { email, password } = validatedFields.data;

    try {
        // Track login attempt
        await trackEvent("user_login_attempt", "auth", { email });

        await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: t("invalid_credentials") };
                default:
                    return { error: t("generic_error") };
            }
        }

        throw error;
    }
};
