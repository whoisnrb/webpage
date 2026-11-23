import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import authConfig from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import bcrypt from "bcryptjs"
import { LoginSchema } from "@/schemas"
import { getUserByEmail, getUserById } from "@/data/user"
import { headers } from "next/headers"

// Prevent hardcoded domain lock in multi-domain setup so Auth.js infers host dynamically
if (process.env.AUTH_URL?.includes('backlineit.hu') || process.env.NEXTAUTH_URL?.includes('backlineit.hu')) {
    delete process.env.AUTH_URL;
    delete process.env.NEXTAUTH_URL;
}

export const { handlers, auth, signIn, signOut } = NextAuth(async (req) => {
    let host = "";
    if (req?.headers) {
        host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
    } else {
        try {
            const h = await headers();
            host = h.get("x-forwarded-host") || h.get("host") || "";
        } catch {
            // Headers not accessible in this context
        }
    }

    const isCom = host.includes("backlineit.com");

    const githubId = isCom
        ? (process.env.GITHUB_CLIENT_ID_COM || "Ov23li4MYbpDwP4Bfndq")
        : (process.env.GITHUB_CLIENT_ID || "Ov23lioM22xhK1IZeyKm");

    const githubSecret = isCom
        ? (process.env.GITHUB_CLIENT_SECRET_COM || "befbb19a2636f282a49e4ed543c2d1aaf6940011")
        : (process.env.GITHUB_CLIENT_SECRET || "30d209abf1d1b1b0b4f50f9e583512d6d6906b9e");

    return {
        ...authConfig,
        trustHost: true,
        adapter: PrismaAdapter(prisma),
        session: { strategy: "jwt" },
        providers: [
            GitHub({
                clientId: githubId,
                clientSecret: githubSecret,
                issuer: "https://github.com/login/oauth",
            }),
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
        ],
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
        }
    };
});
