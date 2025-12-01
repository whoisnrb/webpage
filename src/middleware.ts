import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);
const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isAuthPage = req.nextUrl.pathname.includes("/login") || req.nextUrl.pathname.includes("/register")
    const isAdminPage = req.nextUrl.pathname.includes("/admin")

    if (isAuthPage) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
        }
    }

    if (isAdminPage) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login", req.nextUrl))
        }

        // Note: Role check might need to be moved to layout or page level 
        // if role is not available in the token without database access in middleware
        // For now, we'll keep it simple or rely on session strategy
    }

    // Handle localized API routes (e.g., /hu/api/auth/...) by rewriting to /api/...
    if (req.nextUrl.pathname.includes('/api/')) {
        const apiIndex = req.nextUrl.pathname.indexOf('/api/');
        if (apiIndex > 0) {
            const newPath = req.nextUrl.pathname.substring(apiIndex);
            return NextResponse.rewrite(new URL(newPath, req.url));
        }
        return NextResponse.next();
    }

    return intlMiddleware(req);
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
