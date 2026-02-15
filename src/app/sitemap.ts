import { MetadataRoute } from 'next'
import { getBlogPosts, getBlogSeries } from '@/app/actions/blog'
import { getProducts } from '@/app/actions/product'
import { routing } from '@/i18n/routing'
import { caseStudies } from '@/lib/case-studies-data'
import { industries } from '@/lib/industry-data'
import { landingPages } from '@/config/landing-pages'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://backlineit.hu'
    const locales = routing.locales

    let products: any[] = []
    let posts: any[] = []
    let series: any[] = []

    try {
        products = await getProducts()
    } catch (error) {
        console.warn('Could not fetch products for sitemap generation:', error)
    }

    try {
        posts = await getBlogPosts() as any[]
    } catch (error) {
        console.warn('Could not fetch blog posts for sitemap generation:', error)
    }

    try {
        series = await getBlogSeries() as any[]
    } catch (error) {
        console.warn('Could not fetch blog series for sitemap generation:', error)
    }

    // All static routes with their priorities and change frequency
    const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency'] }[] = [
        { path: '', priority: 1.0, changeFrequency: 'weekly' },
        // Services
        { path: '/szolgaltatasok', priority: 0.9, changeFrequency: 'monthly' },
        { path: '/szolgaltatasok/scriptek', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/szolgaltatasok/webfejlesztes', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/szolgaltatasok/rendszeruzemeltetes', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/szolgaltatasok/biztonsag', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/szolgaltatasok/halozat', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/szolgaltatasok/integraciok', priority: 0.8, changeFrequency: 'monthly' },
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

    // Helper: generate hreflang alternates for a given path
    function getAlternates(path: string) {
        const languages: Record<string, string> = {}
        for (const locale of locales) {
            languages[locale] = `${baseUrl}/${locale}${path}`
        }
        return { languages }
    }

    // Static routes for each locale
    for (const locale of locales) {
        for (const route of staticRoutes) {
            routes.push({
                url: `${baseUrl}/${locale}${route.path}`,
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
            const postPath = `/blog/${post.slug}`
            routes.push({
                url: `${baseUrl}/${locale}${postPath}`,
                lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.createdAt),
                changeFrequency: 'monthly',
                priority: 0.6,
                alternates: getAlternates(postPath),
            })
        }
    }

    // Blog series
    for (const locale of locales) {
        for (const s of series) {
            const seriesPath = `/blog/series/${s.slug}`
            routes.push({
                url: `${baseUrl}/${locale}${seriesPath}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.5,
                alternates: getAlternates(seriesPath),
            })
        }
    }

    // Products (solutions)
    for (const locale of locales) {
        for (const product of products) {
            const productPath = `/megoldasok/${product.slug}`
            routes.push({
                url: `${baseUrl}/${locale}${productPath}`,
                lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
                changeFrequency: 'weekly',
                priority: 0.9,
                alternates: getAlternates(productPath),
            })
        }
    }

    // Case studies (references)
    for (const locale of locales) {
        for (const study of caseStudies) {
            const studyPath = `/referenciak/${study.slug}`
            routes.push({
                url: `${baseUrl}/${locale}${studyPath}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
                alternates: getAlternates(studyPath),
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
            const lpPath = `/lp/${slug}`
            routes.push({
                url: `${baseUrl}/${locale}${lpPath}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
                alternates: getAlternates(lpPath),
            })
        }
    }

    return routes
}
