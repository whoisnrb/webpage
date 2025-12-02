import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { LoginSchema } from "@/schemas"

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
                return null;
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
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
