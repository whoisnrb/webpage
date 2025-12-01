import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import bcrypt from "bcryptjs"
import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"

const githubId = process.env.GITHUB_CLIENT_ID
const githubSecret = process.env.GITHUB_CLIENT_SECRET

if (!githubId || !githubSecret) {
    console.warn("Missing GitHub credentials")
}

export default {
    providers: [
        GitHub({
            clientId: githubId,
            clientSecret: githubSecret,
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
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, user, token }) {
            if (session.user && token?.sub) {
                session.user.id = token.sub
            }
            return session
        },
        async jwt({ token }) {
            return token
        },
        authorized({ auth, request: nextUrl }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.nextUrl.pathname.startsWith('/dashboard')
            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            }
            return true
        },
    }
} satisfies NextAuthConfig
