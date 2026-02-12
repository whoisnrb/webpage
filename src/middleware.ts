import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse } from "next/server"
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);
const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    // 1. API útvonalak azonnali átengedése
    if (nextUrl.pathname.includes('/api/')) {
        return NextResponse.next();
    }

    const isAuthPage = nextUrl.pathname.includes("/login") || nextUrl.pathname.includes("/register");
    const isAdminPage = nextUrl.pathname.includes("/admin") || nextUrl.pathname.includes("/dashboard");

    // 2. Auth logika — CSAK admin/dashboard oldalakra
    if (isAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    if (isAdminPage && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // 3. Nyelvi kezelés (intl)
    return intlMiddleware(req);
})

export const config = {
    // Szigorúbb szűrés: csak az oldalakra fusson le, képekre/scriptekre/api-ra NE
    matcher: [
        '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|.*\\..*).*)',
    ],
};
