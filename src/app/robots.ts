import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/dashboard/',
                    '/admin/',
                    '/checkout/',
                    '/api/',
                    '/login',
                    '/register',
                    // Block query-parameterized quote request URLs from indexing
                    // These are form pre-fill variants (e.g. ?service=..., ?serviceInterest=..., ?subject=...)
                    '/ajanlatkeres?',
                    '/en/request-a-quote?',
                ],
            },
            {
                userAgent: 'GPTBot',
                disallow: '/',
            },
            {
                userAgent: 'CCBot',
                disallow: '/',
            },
        ],
        sitemap: 'https://backlineit.hu/sitemap.xml',
    }
}
