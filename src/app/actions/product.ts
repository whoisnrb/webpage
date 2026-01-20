'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export type Variant = {
    name: string
    price: number
    description: string
}

export type ProductDTO = {
    id: string
    title: string
    description: string
    longDescription: string | null
    price: number
    category: string
    slug: string
    image: string
    features: string[]
    prices: Variant[]
    updatedAt: Date
}

function mapProduct(p: any): ProductDTO {
    const rawPrices = typeof p.prices === 'string' ? JSON.parse(p.prices) : p.prices
    let prices: Variant[] = []

    if (Array.isArray(rawPrices)) {
        prices = rawPrices
    } else {
        // Migration for old object structure
        prices = [
            { name: 'Personal', price: rawPrices.personal || 0, description: '1 weboldalhoz' },
            { name: 'Commercial', price: rawPrices.commercial || 0, description: '5 weboldalhoz + Priority Support' },
            { name: 'Developer', price: rawPrices.developer || 0, description: 'Korlátlan weboldal + Forráskód' }
        ]
    }

    return {
        ...p,
        title: p.name, // Map DB name to DTO title
        features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features,
        prices: prices
    }
}

export async function getProducts(): Promise<ProductDTO[]> {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    })
    console.log('Raw products from DB:', JSON.stringify(products, null, 2))
    try {
        return products.map(mapProduct)
    } catch (error) {
        console.error('Error mapping products:', error)
        throw error
    }
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
    const product = await prisma.product.findUnique({
        where: { slug }
    })
    if (!product) return null
    return mapProduct(product)
}

export async function createProduct(data: Omit<ProductDTO, 'id' | 'updatedAt'>) {
    const { title, ...rest } = data
    await prisma.product.create({
        data: {
            ...rest,
            name: title, // Map DTO title to DB name
            features: JSON.stringify(data.features),
            prices: JSON.stringify(data.prices)
        }
    })
    revalidatePath('/termekek')
    revalidatePath('/admin/products')
}

export async function updateProduct(id: string, data: Partial<ProductDTO>) {
    const updateData: any = { ...data }
    if (data.title) {
        updateData.name = data.title
        delete updateData.title
    }
    if (data.features) updateData.features = JSON.stringify(data.features)
    if (data.prices) updateData.prices = JSON.stringify(data.prices)

    await prisma.product.update({
        where: { id },
        data: updateData
    })
    revalidatePath('/termekek')
    revalidatePath('/admin/products')
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({
        where: { id }
    })
    revalidatePath('/termekek')
    revalidatePath('/admin/products')
}
