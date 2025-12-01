import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email megadása kötelező",
    }),
    password: z.string().min(1, {
        message: "Jelszó megadása kötelező",
    }),
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email megadása kötelező",
    }),
    password: z.string().min(6, {
        message: "A jelszónak legalább 6 karakternek kell lennie",
    }),
    name: z.string().min(1, {
        message: "Név megadása kötelező",
    }),
});
