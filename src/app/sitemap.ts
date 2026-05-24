import { MetadataRoute } from 'next'
import { getBlogPosts, getBlogSeries } from '@/app/actions/blog'
import { getProducts } from '@/app/actions/product'
import { routing, getPathname } from '@/i18n/routing'
import { getReferences } from '@/app/actions/reference'
import { caseStudies as staticCaseStudies } from '@/lib/case-studies-data'
import { industries } from '@/lib/industry-data'
import { landingPages } from '@/config/landing-pages'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://backlineit.hu'
    const locales = routing.locales as readonly ('hu' | 'en')[]

    let products: Awaited<ReturnType<typeof getProducts>> = []
    let posts: Awaited<ReturnType<typeof getBlogPosts>> = []
    let series: Awaited<ReturnType<typeof getBlogSeries>> = []
    let dbReferences: Awaited<ReturnType<typeof getReferences>> = []

    try {
        dbReferences = await getReferences()
    } catch (error) {
        console.warn('Could not fetch references for sitemap generation:', error)
    }

    try {
        products = await getProducts()
    } catch (error) {
        console.warn('Could not fetch products for sitemap generation:', error)
    }

    try {
        posts = await getBlogPosts()
    } catch (error) {
        console.warn('Could not fetch blog posts for sitemap generation:', error)
    }

    try {
        series = await getBlogSeries()
    } catch (error) {
        console.warn('Could not fetch blog series for sitemap generation:', error)
    }

    // All static routes with their priorities and change frequency
    const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'] }[] = [
        { path: '', priority: 1.0, changeFrequency: 'weekly' },
        // Services (All 13 localized services)
        { path: '/szolgaltatasok', priority: 0.9, changeFrequency: 'monthly' },
        { path: '/szolgaltatasok/scriptek', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/szolgaltatasok/webfejlesztes', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/szolgaltatasok/rendszeruzemeltetes', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/szolgaltatasok/biztonsag', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/szolgaltatasok/halozat', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/szolgaltatasok/integraciok', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/szolgaltatasok/wordpress-woocommerce-karbantartas', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/szolgaltatasok/kkv-it-audit', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/szolgaltatasok/webshop-automatizacio', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/szolgaltatasok/ai-asszisztensek', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/szolgaltatasok/microsoft-365-google-workspace', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/szolgaltatasok/backup-adatmentes', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/szolgaltatasok/havidijas-rendszergazda', priority: 0.8, changeFrequency: 'monthly' },
        // Main pages
        { path: '/megoldasok', priority: 0.9, changeFrequency: 'weekly' },
        { path: '/referenciak', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/blog', priority: 0.8, changeFrequency: 'daily' },
        { path: '/kapcsolat', priority: 0.7, changeFrequency: 'monthly' },
        { path: '/arak', priority: 0.9, changeFrequency: 'monthly' },
        { path: '/rolunk', priority: 0.6, changeFrequency: 'monthly' },
        { path: '/demo', priority: 0.7, changeFrequency: 'monthly' },
        { path: '/konzultacio', priority: 0.7, changeFrequency: 'monthly' },
        { path: '/ajanlatkeres', priority: 0.7, changeFrequency: 'monthly' },
        { path: '/karrier', priority: 0.5, changeFrequency: 'monthly' },
        { path: '/karrier/jelentkezes', priority: 0.4, changeFrequency: 'monthly' },
        // Legal
        { path: '/impresszum', priority: 0.3, changeFrequency: 'yearly' },
        { path: '/aszf', priority: 0.3, changeFrequency: 'yearly' },
        { path: '/adatvedelem', priority: 0.3, changeFrequency: 'yearly' },
    ]

    const routes: MetadataRoute.Sitemap = []

    // Helper to get localized pathname using next-intl getPathname
    function resolvePathname(
        locale: 'hu' | 'en',
        href: string | { pathname: string; params?: Record<string, string | number> }
    ): string {
        try {
            const path = getPathname({ locale, href: href as Parameters<typeof getPathname>[0]['href'] })
            return path === '/' ? '' : path
        } catch {
            if (typeof href === 'string') {
                return href
            } else if (href && href.pathname) {
                let p = href.pathname
                if (href.params) {
                    for (const [key, val] of Object.entries(href.params)) {
                        p = p.replace(`[${key}]`, String(val))
                    }
                }
                return p
            }
            return ''
        }
    }

    // Helper: generate hreflang alternates for a given path
    function getAlternates(href: string | { pathname: string; params?: Record<string, string | number> }) {
        const languages: Record<string, string> = {}
        for (const locale of locales) {
            const path = resolvePathname(locale, href)
            languages[locale] = `${baseUrl}/${locale}${path}`
        }
        return { languages }
    }

    // Static routes for each locale
    for (const locale of locales) {
        for (const route of staticRoutes) {
            const path = resolvePathname(locale, route.path)
            routes.push({
                url: `${baseUrl}/${locale}${path}`,
                lastModified: new Date(),
                changeFrequency: route.changeFrequency,
                priority: route.priority,
                alternates: getAlternates(route.path),
            })
        }
    }

    // Blog posts
    for (const locale of locales) {
        for (const post of posts.filter(p => p.published)) {
            const hrefObj = { pathname: '/blog/[slug]', params: { slug: post.slug } }
            const path = resolvePathname(locale, hrefObj)
            routes.push({
                url: `${baseUrl}/${locale}${path}`,
                lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.createdAt),
                changeFrequency: 'monthly',
                priority: 0.6,
                alternates: getAlternates(hrefObj),
            })
        }
    }

    // Blog series
    for (const locale of locales) {
        for (const s of series) {
            const path = `/blog/series/${s.slug}`
            routes.push({
                url: `${baseUrl}/${locale}${path}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.5,
                alternates: getAlternates(path),
            })
        }
    }

    // Products (solutions)
    for (const locale of locales) {
        for (const product of products) {
            const hrefObj = { pathname: '/megoldasok/[slug]', params: { slug: product.slug } }
            const path = resolvePathname(locale, hrefObj)
            routes.push({
                url: `${baseUrl}/${locale}${path}`,
                lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
                changeFrequency: 'weekly',
                priority: 0.9,
                alternates: getAlternates(hrefObj),
            })
        }
    }

    // Case studies (references)
    const allReferences = [
        ...staticCaseStudies.map(s => ({ slug: s.slug, updatedAt: new Date() })),
        ...dbReferences.filter(r => r.active).map(r => ({ slug: r.slug, updatedAt: r.updatedAt }))
    ]

    for (const locale of locales) {
        for (const study of allReferences) {
            const hrefObj = { pathname: '/referenciak/[slug]', params: { slug: study.slug } }
            const path = resolvePathname(locale, hrefObj)
            routes.push({
                url: `${baseUrl}/${locale}${path}`,
                lastModified: study.updatedAt,
                changeFrequency: 'monthly',
                priority: 0.6,
                alternates: getAlternates(hrefObj),
            })
        }
    }

    // Industry & landing pages
    const lpSlugs = [
        ...industries.map(i => i.slug),
        ...Object.keys(landingPages),
    ]
    for (const locale of locales) {
        for (const slug of lpSlugs) {
            const path = `/lp/${slug}`
            routes.push({
                url: `${baseUrl}/${locale}${path}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
                alternates: getAlternates(path),
            })
        }
    }

    return routes
}
