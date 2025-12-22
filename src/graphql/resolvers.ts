import { prisma } from "@/lib/db"

export const resolvers = {
    Query: {
        products: async () => {
            const products = await prisma.product.findMany({
                orderBy: { createdAt: 'desc' }
            })
            return products.map(p => ({
                ...p,
                title: p.name,
                features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features,
                prices: typeof p.prices === 'string' ? JSON.parse(p.prices) : p.prices
            }))
        },
        product: async (_: any, { slug }: { slug: string }) => {
            const p = await prisma.product.findUnique({
                where: { slug }
            })
            if (!p) return null
            return {
                ...p,
                title: p.name,
                features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features,
                prices: typeof p.prices === 'string' ? JSON.parse(p.prices) : p.prices
            }
        },
        posts: async () => {
            return await prisma.blogPost.findMany({
                orderBy: { createdAt: 'desc' }
            })
        },
        post: async (_: any, { slug }: { slug: string }) => {
            return await prisma.blogPost.findUnique({
                where: { slug }
            })
        }
    }
}
