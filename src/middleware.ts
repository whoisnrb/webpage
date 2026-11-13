import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse, type NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
    const { pathname, search } = req.nextUrl;

    // 1. API útvonalak azonnali átengedése (auth végpontok és webhookok)
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

    // 3. Tiszta intl middleware routing
    // A védett oldalakat (dashboard, admin) a Server Component Layoutok és Page-ek ellenőrzik
    // közvetlenül a Node.js runtime-ban, megszüntetve a middleware redirect-loop (ERR_TOO_MANY_REDIRECTS) hibát.
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

