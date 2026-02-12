'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export type ServiceDTO = {
    id: string
    name: string
    nameEn: string | null
    slug: string
    description: string
    descriptionEn: string | null
    price: number
    icon: string
    href: string
    features: string[]
    featuresEn: string[] | null
    active: boolean
    sortOrder: number
    updatedAt: Date
}

function mapService(s: any): ServiceDTO {
    return {
        ...s,
        features: typeof s.features === 'string' ? JSON.parse(s.features) : s.features,
        featuresEn: s.featuresEn ? (typeof s.featuresEn === 'string' ? JSON.parse(s.featuresEn) : s.featuresEn) : null,
    }
}

export async function getServices(): Promise<ServiceDTO[]> {
    const services = await prisma.service.findMany({
        orderBy: { sortOrder: 'asc' }
    })
    return services.map(mapService)
}

export async function getActiveServices(): Promise<ServiceDTO[]> {
    const services = await prisma.service.findMany({
        where: { active: true },
        orderBy: { sortOrder: 'asc' }
    })
    return services.map(mapService)
}

export async function getServiceById(id: string): Promise<ServiceDTO | null> {
    const service = await prisma.service.findUnique({
        where: { id }
    })
    if (!service) return null
    return mapService(service)
}

export async function getServiceBySlug(slug: string): Promise<ServiceDTO | null> {
    const service = await prisma.service.findUnique({
        where: { slug }
    })
    if (!service) return null
    return mapService(service)
}

export async function createService(data: Omit<ServiceDTO, 'id' | 'updatedAt'>) {
    await prisma.service.create({
        data: {
            name: data.name,
            nameEn: data.nameEn || null,
            slug: data.slug,
            description: data.description,
            descriptionEn: data.descriptionEn || null,
            price: data.price,
            icon: data.icon,
            href: data.href,
            features: JSON.stringify(data.features),
            featuresEn: data.featuresEn ? JSON.stringify(data.featuresEn) : null,
            active: data.active,
            sortOrder: data.sortOrder,
        }
    })
    revalidatePath('/szolgaltatasok')
    revalidatePath('/admin/services')
}

export async function updateService(id: string, data: Partial<ServiceDTO>) {
    const updateData: any = { ...data }

    if (data.features) updateData.features = JSON.stringify(data.features)
    if (data.featuresEn !== undefined) {
        updateData.featuresEn = data.featuresEn ? JSON.stringify(data.featuresEn) : null
    }

    // Remove fields that shouldn't be passed directly
    delete updateData.id
    delete updateData.updatedAt

    await prisma.service.update({
        where: { id },
        data: updateData
    })
    revalidatePath('/szolgaltatasok')
    revalidatePath('/admin/services')
}

export async function deleteService(id: string) {
    await prisma.service.delete({
        where: { id }
    })
    revalidatePath('/szolgaltatasok')
    revalidatePath('/admin/services')
}
