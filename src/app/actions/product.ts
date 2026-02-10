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
    titleEn: string | null
    description: string
    descriptionEn: string | null
    longDescription: string | null
    longDescriptionEn: string | null
    price: number
    category: string
    slug: string
    image: string
    features: string[]
    featuresEn: string[] | null
    prices: Variant[]
    updatedAt: Date
}

/** Localized product - resolved to the correct language */
export type LocalizedProductDTO = {
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
        title: p.name,
        titleEn: p.nameEn || null,
        descriptionEn: p.descriptionEn || null,
        longDescriptionEn: p.longDescriptionEn || null,
        features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features,
        featuresEn: p.featuresEn ? (typeof p.featuresEn === 'string' ? JSON.parse(p.featuresEn) : p.featuresEn) : null,
        prices: prices
    }
}

/** Resolve a ProductDTO to the correct language */
function localizeProduct(product: ProductDTO, locale: string): LocalizedProductDTO {
    const isEn = locale === 'en'
    return {
        id: product.id,
        title: (isEn && product.titleEn) ? product.titleEn : product.title,
        description: (isEn && product.descriptionEn) ? product.descriptionEn : product.description,
        longDescription: (isEn && product.longDescriptionEn) ? product.longDescriptionEn : product.longDescription,
        price: product.price,
        category: product.category,
        slug: product.slug,
        image: product.image,
        features: (isEn && product.featuresEn && product.featuresEn.length > 0) ? product.featuresEn : product.features,
        prices: product.prices,
        updatedAt: product.updatedAt
    }
}

export async function getProducts(): Promise<ProductDTO[]> {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    })
    try {
        return products.map(mapProduct)
    } catch (error) {
        console.error('Error mapping products:', error)
        throw error
    }
}

/** Get all products localized to a specific language */
export async function getLocalizedProducts(locale: string = 'hu'): Promise<LocalizedProductDTO[]> {
    const products = await getProducts()
    return products.map(p => localizeProduct(p, locale))
}

export async function getProductBySlug(slug: string): Promise<ProductDTO | null> {
    const product = await prisma.product.findUnique({
        where: { slug }
    })
    if (!product) return null
    return mapProduct(product)
}

/** Get a single product localized to a specific language */
export async function getLocalizedProductBySlug(slug: string, locale: string = 'hu'): Promise<LocalizedProductDTO | null> {
    const product = await getProductBySlug(slug)
    if (!product) return null
    return localizeProduct(product, locale)
}

export async function createProduct(data: Omit<ProductDTO, 'id' | 'updatedAt'>) {
    const { title, titleEn, featuresEn, descriptionEn, longDescriptionEn, ...rest } = data
    await prisma.product.create({
        data: {
            ...rest,
            name: title,
            nameEn: titleEn || null,
            descriptionEn: descriptionEn || null,
            longDescriptionEn: longDescriptionEn || null,
            features: JSON.stringify(data.features),
            featuresEn: featuresEn ? JSON.stringify(featuresEn) : null,
            prices: JSON.stringify(data.prices)
        }
    })
    revalidatePath('/megoldasok')
    revalidatePath('/admin/products')
}

export async function updateProduct(id: string, data: Partial<ProductDTO>) {
    const updateData: any = { ...data }
    if (data.title) {
        updateData.name = data.title
        delete updateData.title
    }
    if (data.titleEn !== undefined) {
        updateData.nameEn = data.titleEn
        delete updateData.titleEn
    }
    if (data.descriptionEn !== undefined) {
        updateData.descriptionEn = data.descriptionEn
    }
    if (data.longDescriptionEn !== undefined) {
        updateData.longDescriptionEn = data.longDescriptionEn
    }
    if (data.features) updateData.features = JSON.stringify(data.features)
    if (data.featuresEn !== undefined) {
        updateData.featuresEn = data.featuresEn ? JSON.stringify(data.featuresEn) : null
    }
    if (data.prices) updateData.prices = JSON.stringify(data.prices)

    delete updateData.descriptionEn
    // Re-add if it was in data
    if (data.descriptionEn !== undefined) updateData.descriptionEn = data.descriptionEn
    if (data.longDescriptionEn !== undefined) updateData.longDescriptionEn = data.longDescriptionEn

    await prisma.product.update({
        where: { id },
        data: updateData
    })
    revalidatePath('/megoldasok')
    revalidatePath('/admin/products')
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({
        where: { id }
    })
    revalidatePath('/megoldasok')
    revalidatePath('/admin/products')
}
