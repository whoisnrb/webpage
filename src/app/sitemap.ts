import { MetadataRoute } from 'next'
import { getBlogPosts } from '@/app/actions/blog'
import { getProducts } from '@/app/actions/product'
import { routing } from '@/i18n/routing'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://backlineit.hu'
    const locales = routing.locales

    let products: any[] = []
    let posts: any[] = []

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

    const staticRoutes = [
        '',
        '/szolgaltatasok',
        '/szolgaltatasok/scriptek',
        '/szolgaltatasok/webfejlesztes',
        '/szolgaltatasok/rendszeruzemeltetes',
        '/szolgaltatasok/biztonsag',
        '/termekek',
        '/referenciak',
        '/blog',
        '/kapcsolat',
        '/arak',
        '/rolunk',
    ]

    const routes: MetadataRoute.Sitemap = []

    // Generate entries for each locale
    for (const locale of locales) {
        // Base static routes
        for (const route of staticRoutes) {
            routes.push({
                url: `${baseUrl}/${locale}${route}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1.0 : 0.8,
            })
        }

        // Blog posts
        for (const post of posts.filter(p => p.published)) {
            routes.push({
                url: `${baseUrl}/${locale}/blog/${post.slug}`,
                lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.createdAt),
                changeFrequency: 'monthly',
                priority: 0.6,
            })
        }

        // Products
        for (const product of products) {
            routes.push({
                url: `${baseUrl}/${locale}/termekek/${product.slug}`,
                lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
                changeFrequency: 'weekly',
                priority: 0.9,
            })
        }
    }

    return routes
}
