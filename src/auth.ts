import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import authConfig from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { LoginSchema } from "@/schemas"
import { getUserByEmail, getUserById } from "@/data/user"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    callbacks: {
        ...authConfig.callbacks,
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;

                // Sync directly from database so any role changes are immediately reflected
                // without requiring re-login or waiting for JWT expiration!
                try {
                    const dbUser = await getUserById(token.sub);
                    if (dbUser) {
                        session.user.role = dbUser.role as any;
                        session.user.name = dbUser.name || session.user.name;
                    } else if (token.role) {
                        session.user.role = token.role as any;
                    }
                } catch {
                    if (token.role) {
                        session.user.role = token.role as any;
                    }
                }
            } else if (token.role && session.user) {
                session.user.role = token.role as any;
            }

            if (token.name && session.user && !session.user.name) {
                session.user.name = token.name;
            }

            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            // Fetch latest user from DB by ID (or fallback to email)
            const existingUser = await getUserById(token.sub) || (token.email ? await getUserByEmail(token.email as string) : null);

            if (!existingUser) return token;

            token.role = existingUser.role;
            token.name = existingUser.name;
            token.email = existingUser.email;

            return token;
        }
    },
    providers: [
        ...authConfig.providers.filter((provider: any) => provider.id !== "credentials"),
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const user = await getUserByEmail(email);
                    if (!user || !user.password) return null;

                    const passwordsMatch = await bcrypt.compare(
                        password,
                        user.password
                    );

                    if (passwordsMatch) return user;
                }

                return null;
            }
        })
    ]
})
