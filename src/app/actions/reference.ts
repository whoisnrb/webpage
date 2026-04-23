'use server'

import { prisma } from "@/lib/db"
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache"

export type Metric = {
    value: string
    label: string
    labelEn?: string
}

export type ReferenceDTO = {
    id: string
    slug: string
    title: string
    titleEn: string | null
    client: string
    clientEn: string | null
    category: string
    categoryEn: string | null
    description: string
    descriptionEn: string | null
    challenge: string
    challengeEn: string | null
    solution: string
    solutionEn: string | null
    result: string
    resultEn: string | null
    image: string
    galleryImages: string[]
    content: string | null
    contentEn: string | null
    type: string
    documentationFile: string | null
    showDocumentation: boolean
    tags: string[]
    metrics: Metric[] | null
    active: boolean
    updatedAt: Date
}

export type LocalizedReferenceDTO = {
    id: string,
    slug: string
    title: string
    client: string
    category: string
    description: string
    challenge: string
    solution: string
    result: string
    image: string
    galleryImages: string[]
    content: string | null
    type: string
    documentationFile: string | null
    showDocumentation: boolean
    tags: string[]
    metrics: Metric[] | null
    updatedAt: Date
}

function mapReference(r: any): ReferenceDTO {
    return {
        ...r,
        metrics: r.metrics ? (typeof r.metrics === 'string' ? JSON.parse(r.metrics) : r.metrics) : null
    }
}

function localizeReference(ref: ReferenceDTO, locale: string): LocalizedReferenceDTO {
    const isEn = locale === 'en'
    return {
        id: ref.id,
        slug: ref.slug,
        title: (isEn && ref.titleEn) ? ref.titleEn : ref.title,
        client: (isEn && ref.clientEn) ? ref.clientEn : ref.client,
        category: (isEn && ref.categoryEn) ? ref.categoryEn : ref.category,
        description: (isEn && ref.descriptionEn) ? ref.descriptionEn : ref.description,
        challenge: (isEn && ref.challengeEn) ? ref.challengeEn : ref.challenge,
        solution: (isEn && ref.solutionEn) ? ref.solutionEn : ref.solution,
        result: (isEn && ref.resultEn) ? ref.resultEn : ref.result,
        image: ref.image,
        galleryImages: ref.galleryImages,
        content: (isEn && ref.contentEn) ? ref.contentEn : ref.content,
        type: ref.type,
        documentationFile: ref.documentationFile,
        showDocumentation: ref.showDocumentation,
        tags: ref.tags,
        metrics: ref.metrics ? ref.metrics.map(m => ({
            value: m.value,
            label: (isEn && m.labelEn) ? m.labelEn : m.label
        })) : null,
        updatedAt: ref.updatedAt
    }
}

const getCachedReferences = unstable_cache(
    async () => {
        const references = await (prisma as any).reference.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return references.map(mapReference)
    },
    ['all-references'],
    { revalidate: 3600, tags: ['references'] }
)

export async function getReferences(): Promise<ReferenceDTO[]> {
    return getCachedReferences()
}

export async function getLocalizedReferences(locale: string = 'hu'): Promise<LocalizedReferenceDTO[]> {
    const refs = await getReferences()
    return refs.filter(r => r.active).map(r => localizeReference(r, locale))
}

export async function getReferenceBySlug(slug: string) {
    const reference = await (prisma as any).reference.findUnique({
        where: { slug }
    })
    if (!reference) return null
    return mapReference(reference)
}

export async function getLocalizedReferenceBySlug(slug: string, locale: string = 'hu'): Promise<LocalizedReferenceDTO | null> {
    const ref = await getReferenceBySlug(slug)
    if (!ref) return null
    return localizeReference(ref, locale)
}

export async function createReference(data: Omit<ReferenceDTO, 'id' | 'updatedAt'>) {
    try {
        await (prisma as any).reference.create({
            data: {
                ...data,
                metrics: data.metrics ? JSON.stringify(data.metrics) : null,
                documentationFile: data.documentationFile,
                showDocumentation: data.showDocumentation
            }
        })
        revalidateTag('references', 'default')
        revalidatePath('/referenciak')
        revalidatePath('/admin/references')
    } catch (error) {
        console.error("CREATE REFERENCE ERROR:", error)
        throw error
    }
}

export async function updateReference(id: string, data: Partial<ReferenceDTO>) {
    try {
        const updateData: any = { ...data }
        if (data.metrics !== undefined) {
            updateData.metrics = data.metrics ? JSON.stringify(data.metrics) : null
        }

        await (prisma as any).reference.update({
            where: { id },
            data: {
                ...updateData,
                documentationFile: data.documentationFile !== undefined ? data.documentationFile : undefined,
                showDocumentation: data.showDocumentation !== undefined ? data.showDocumentation : undefined,
            }
        })
        revalidateTag('references', 'default')
        revalidatePath('/referenciak')
        revalidatePath('/admin/references')
    } catch (error) {
        console.error("UPDATE REFERENCE ERROR:", error)
        throw error
    }
}

export async function deleteReference(id: string) {
    await (prisma as any).reference.delete({
        where: { id }
    })
    revalidateTag('references', 'default')
    revalidatePath('/referenciak')
    revalidatePath('/admin/references')
}
