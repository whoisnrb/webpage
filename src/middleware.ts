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

    const isAuthPage = nextUrl.pathname.includes("/login") || nextUrl.pathname.includes("/register");
    const isAdminPage = nextUrl.pathname.includes("/admin") || nextUrl.pathname.includes("/dashboard");

    // Auth logika — CSAK admin/dashboard oldalakra
    if (isAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    if (isAdminPage && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // Nyelvi kezelés (intl)
    return intlMiddleware(req);
})

const REDIRECT_MAP: Record<string, string> = {
    '/en/rolunk': '/en/about-us',
    '/en/referenciak': '/en/references',
    '/en/arak': '/en/pricing',
    '/en/kapcsolat': '/en/contact',
    '/en/szolgaltatasok': '/en/services',
    '/en/szolgaltatasok/biztonsag': '/en/services/security',
    '/en/szolgaltatasok/halozat': '/en/services/network',
    '/en/szolgaltatasok/integraciok': '/en/services/integrations',
    '/en/szolgaltatasok/rendszeruzemeltetes': '/en/services/system-administration',
    '/en/szolgaltatasok/scriptek': '/en/services/scripts',
    '/en/szolgaltatasok/webfejlesztes': '/en/services/web-development',
    '/en/megoldasok': '/en/solutions',
    '/en/velemeny': '/en/testimonials',
    '/en/konzultacio': '/en/consultation',
    '/en/karrier': '/en/careers',
    '/en/karrier/jelentkezes': '/en/careers/apply',
    '/en/impresszum': '/en/imprint',
    '/en/adatvedelem': '/en/privacy-policy',
    '/en/aszf': '/en/terms-and-conditions',
    '/en/ajanlatkeres': '/en/request-a-quote',
};

export default function middleware(req: NextRequest, event: NextFetchEvent) {
    const { pathname } = req.nextUrl;

    // 0. SEO Redirects for renamed English routes (301 Permanent)
    if (pathname.startsWith('/en/')) {
        // Exact matches
        if (REDIRECT_MAP[pathname]) {
            return NextResponse.redirect(new URL(REDIRECT_MAP[pathname], req.nextUrl), 301);
        }

        // Dynamic matches for references and solutions
        if (pathname.startsWith('/en/referenciak/')) {
            const slug = pathname.replace('/en/referenciak/', '');
            return NextResponse.redirect(new URL(`/en/references/${slug}`, req.nextUrl), 301);
        }
        if (pathname.startsWith('/en/megoldasok/')) {
            const slug = pathname.replace('/en/megoldasok/', '');
            return NextResponse.redirect(new URL(`/en/solutions/${slug}`, req.nextUrl), 301);
        }
    }

    // 1. API útvonalak azonnali átengedése
    if (pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // 2. Auth/Admin oldalak - auth middleware szükséges
    if (pathname.includes("/login") || pathname.includes("/register") ||
        pathname.includes("/admin") || pathname.includes("/dashboard")) {
        return (authMiddleware as any)(req, event);
    }

    // 3. Minden más - csak intl middleware
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

