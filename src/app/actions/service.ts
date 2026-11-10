'use server'

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createAuditLog } from "@/lib/audit"
import { cached, redisDelPattern } from "@/lib/redis"

export type ServicePackage = {
    name: string
    nameEn: string
    desc: string
    descEn: string
    price: number
    sub: string
    subEn: string
    badge?: string
    badgeEn?: string
    popular?: boolean
    features: string[]
    featuresEn: string[]
    duration_label: string
    duration_labelEn: string
}

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
    packages: ServicePackage[] | null
    active: boolean
    sortOrder: number
    updatedAt: Date
}

function mapService(s: any): ServiceDTO {
    return {
        ...s,
        updatedAt: s.updatedAt ? new Date(s.updatedAt) : new Date(),
        features: typeof s.features === 'string' ? JSON.parse(s.features) : (s.features || []),
        featuresEn: s.featuresEn ? (typeof s.featuresEn === 'string' ? JSON.parse(s.featuresEn) : s.featuresEn) : null,
        packages: s.packages ? (typeof s.packages === 'string' ? JSON.parse(s.packages) : s.packages) : null,
    }
}

export async function getServices(): Promise<ServiceDTO[]> {
    try {
        const raw = await cached("services:all", 3600, async () => {
            return await prisma.service.findMany({
                orderBy: { sortOrder: 'asc' }
            })
        })
        return raw.map(mapService)
    } catch (error) {
        console.error("Error fetching services:", error)
        return []
    }
}

export async function getActiveServices(): Promise<ServiceDTO[]> {
    try {
        const raw = await cached("services:active", 3600, async () => {
            return await prisma.service.findMany({
                where: { active: true },
                orderBy: { sortOrder: 'asc' }
            })
        })
        return raw.map(mapService)
    } catch (error) {
        console.error("Error fetching active services:", error)
        return []
    }
}

export async function getServiceById(id: string): Promise<ServiceDTO | null> {
    try {
        const raw = await cached(`services:id:${id}`, 3600, async () => {
            return await prisma.service.findUnique({
                where: { id }
            })
        })
        if (!raw) return null
        return mapService(raw)
    } catch (error) {
        console.error("Error fetching service by id:", error)
        return null
    }
}

export async function getServiceBySlug(slug: string): Promise<ServiceDTO | null> {
    try {
        const raw = await cached(`services:slug:${slug}`, 3600, async () => {
            return await prisma.service.findUnique({
                where: { slug }
            })
        })
        if (!raw) return null
        return mapService(raw)
    } catch (error) {
        console.error("Error fetching service by slug:", error)
        return null
    }
}

export async function createService(data: Omit<ServiceDTO, 'id' | 'updatedAt'>) {
    const service = await prisma.service.create({
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
            packages: data.packages ? JSON.stringify(data.packages) : null,
            active: data.active,
            sortOrder: data.sortOrder,
        }
    })

    await createAuditLog({
        action: "CREATE_SERVICE",
        entity: "Service",
        entityId: service.id,
        details: `Szolgáltatás létrehozva: ${service.name} (Slug: ${service.slug})`
    })

    await redisDelPattern("services:*")
    revalidatePath('/szolgaltatasok')
    revalidatePath('/admin/services')
    return service
}

export async function updateService(id: string, data: Partial<ServiceDTO>) {
    const updateData: any = { ...data }

    if (data.features) updateData.features = JSON.stringify(data.features)
    if (data.featuresEn !== undefined) {
        updateData.featuresEn = data.featuresEn ? JSON.stringify(data.featuresEn) : null
    }
    if (data.packages !== undefined) {
        updateData.packages = data.packages ? JSON.stringify(data.packages) : null
    }

    // Remove fields that shouldn't be passed directly
    delete updateData.id
    delete updateData.updatedAt

    const service = await prisma.service.update({
        where: { id },
        data: updateData
    })

    await createAuditLog({
        action: "UPDATE_SERVICE",
        entity: "Service",
        entityId: id,
        details: `Szolgáltatás módosítva: ${service.name} (Aktív: ${service.active})`
    })

    await redisDelPattern("services:*")
    revalidatePath('/szolgaltatasok')
    revalidatePath('/admin/services')
    return service
}

export async function deleteService(id: string) {
    const service = await prisma.service.delete({
        where: { id }
    })

    await createAuditLog({
        action: "DELETE_SERVICE",
        entity: "Service",
        entityId: id,
        details: `Szolgáltatás törölve: ${service.name}`
    })

    await redisDelPattern("services:*")
    revalidatePath('/szolgaltatasok')
    revalidatePath('/admin/services')
    return service
}
