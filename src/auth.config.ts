import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import type { Provider } from "next-auth/providers"
import { LoginSchema } from "@/schemas"

const githubId = process.env.GITHUB_ID
const githubSecret = process.env.GITHUB_SECRET

const providers: Provider[] = [
    Credentials({
        async authorize(credentials) {
            return null;
        }
    })
]

if (githubId && githubSecret) {
    providers.push(
        GitHub({
            clientId: githubId,
            clientSecret: githubSecret,
        })
    )
}

export default {
    providers,
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
