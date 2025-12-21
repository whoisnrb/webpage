import { MetadataRoute } from 'next'
import { getBlogPosts } from '@/app/actions/blog'
import { getProducts } from '@/app/actions/product'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://backlineit.hu'
    let products: any[] = []
    let posts: any[] = []

    try {
        products = await getProducts()
    } catch (error) {
        console.warn('Could not fetch products for sitemap generation:', error)
    }

    try {
        // We cast to any[] because explicit types might not be available without prisma generate
        posts = await getBlogPosts() as any[]
    } catch (error) {
        console.warn('Could not fetch blog posts for sitemap generation:', error)
    }

    // Static pages
    const routes = [
        '',
        '/szolgaltatasok',
        '/szolgaltatasok/scriptek',
        '/szolgaltatasok/webfejlesztes',
        '/szolgaltatasok/rendszeruzemeltetes',
        '/szolgaltatasok/biztonsag',
        '/termekek',
        '/referenciak',
        '/blog',
        '/login',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    const blogRoutes = posts.filter(post => post.published).map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.createdAt),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))

    const productRoutes = products.map((product) => ({
        url: `${baseUrl}/termekek/${product.slug}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    return [...routes, ...blogRoutes, ...productRoutes]
}
