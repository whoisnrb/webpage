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
    
    let response: NextResponse;
    if (isQuoteRequest && search && search.length > 1) {
        response = intlMiddleware(req);
        response.headers.set('X-Robots-Tag', 'noindex, follow');
    } else {
        response = intlMiddleware(req);
    }

    // 3. Biztosítjuk, hogy a belső konténer port (:3000) soha ne szivárogjon ki a Location átirányítási fejlécekbe
    const location = response.headers.get('location');
    if (location) {
        try {
            const url = new URL(location);
            if (url.port === '3000' || url.port === '8080') {
                url.port = '';
                response.headers.set('location', url.toString());
            }
        } catch {
            if (location.includes(':3000')) {
                response.headers.set('location', location.replace(':3000', ''));
            }
        }
    }

    return response;
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

