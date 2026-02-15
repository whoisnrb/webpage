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
        host: 'https://backlineit.hu',
        sitemap: 'https://backlineit.hu/sitemap.xml',
    }
}
