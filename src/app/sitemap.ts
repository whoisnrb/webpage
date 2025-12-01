import { MetadataRoute } from 'next'
import { blogPosts } from '@/data/blog-posts'
import { getProducts } from '@/app/actions/product'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://itservices.hu'
    const products = await getProducts()

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

    const blogRoutes = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(), // In a real app, use post.date or updated date
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
