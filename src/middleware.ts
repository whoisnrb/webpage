import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server"
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);
const { auth } = NextAuth(authConfig)

const authMiddleware = auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isProtectedPage = nextUrl.pathname.includes("/admin") || nextUrl.pathname.includes("/dashboard");

    if (isProtectedPage && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // Nyelvi kezelés (intl)
    return intlMiddleware(req);
})

export default function middleware(req: NextRequest, event: NextFetchEvent) {
    const { pathname, search } = req.nextUrl;

    // 1. API útvonalak azonnali átengedése
    if (pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // 2. Query-paraméteres ajánlatkérés URL-ek: noindex (SEO)
    // Google ne indexelje a ?service=..., ?serviceInterest=..., ?subject=... variánsokat
    const isQuoteRequest = pathname === '/ajanlatkeres' || pathname === '/hu/ajanlatkeres' 
        || pathname === '/en/request-a-quote';
    if (isQuoteRequest && search && search.length > 1) {
        const response = intlMiddleware(req);
        response.headers.set('X-Robots-Tag', 'noindex, follow');
        return response;
    }

    // 3. CSAK védett oldalak (admin és dashboard) menjenek át az auth middleware-en
    // A /login és /register publikus, nem szabad auth-csapdába / redirect loopba vinni!
    if (pathname.includes("/admin") || pathname.includes("/dashboard")) {
        return (authMiddleware as any)(req, event);
    }

    // 4. Minden más (beleértve a /login és /register-t) - csak tiszta intl middleware
    return intlMiddleware(req);
}

export const config = {
    // Optimalizált matcher - kihagyja az összes statikus fájlt
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         * - assets folder
         * - All files with extensions (.js, .css, .png, .jpg, etc.)
         */
        '/((?!_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt|sw.js|.*\\..*).*)',
    ],
};
