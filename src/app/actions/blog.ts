
"use server"

import { prisma as db } from "@/lib/db"
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache"

export type BlogPostData = {
    title: string
    titleEn?: string
    slug: string
    excerpt: string
    excerptEn?: string
    content: string
    contentEn?: string
    author?: string
    tags: string[]
    published: boolean
    featured: boolean
    coverImage?: string
    seriesId?: string | null
}

export type BlogSeriesData = {
    title: string
    titleEn?: string
    slug: string
    description: string
    descriptionEn?: string
    coverImage?: string
}

// ── Blog Posts CRUD ────────────────────────────────────────────────

export async function createBlogPost(data: BlogPostData) {
    try {
        await db.blogPost.create({
            data: {
                ...data,
                author: data.author || "BacklineIT Team",
                seriesId: data.seriesId || null,
            }
        })
        revalidateTag('blog', 'default')
        revalidatePath("/blog")
        revalidatePath("/admin/blog")
        return { success: true }
    } catch (error) {
        console.error("Error creating blog post:", error)
        return { success: false, error: "Failed to create blog post" }
    }
}

export async function updateBlogPost(id: string, data: BlogPostData) {
    try {
        await db.blogPost.update({
            where: { id },
            data: {
                ...data,
                seriesId: data.seriesId || null,
            }
        })
        revalidateTag('blog', 'default')
        revalidatePath("/blog")
        revalidatePath("/admin/blog")
        revalidatePath(`/blog/${data.slug}`)
        return { success: true }
    } catch (error) {
        console.error("Error updating blog post:", error)
        return { success: false, error: "Failed to update blog post" }
    }
}

export async function deleteBlogPost(id: string) {
    try {
        await db.blogPost.delete({
            where: { id }
        })
        revalidateTag('blog', 'default')
        revalidatePath("/blog")
        revalidatePath("/admin/blog")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to delete blog post" }
    }
}

export async function togglePublished(id: string) {
    try {
        const post = await db.blogPost.findUnique({ where: { id } })
        if (!post) return { success: false, error: "Post not found" }
        await db.blogPost.update({
            where: { id },
            data: { published: !post.published }
        })
        revalidateTag('blog', 'default')
        revalidatePath("/blog")
        revalidatePath("/admin/blog")
        return { success: true, published: !post.published }
    } catch (error) {
        return { success: false, error: "Failed to toggle published" }
    }
}

export async function toggleFeatured(id: string) {
    try {
        const post = await db.blogPost.findUnique({ where: { id } })
        if (!post) return { success: false, error: "Post not found" }
        await db.blogPost.update({
            where: { id },
            data: { featured: !post.featured }
        })
        revalidateTag('blog', 'default')
        revalidatePath("/admin/blog")
        return { success: true, featured: !post.featured }
    } catch (error) {
        return { success: false, error: "Failed to toggle featured" }
    }
}

export async function getBlogPostById(id: string) {
    try {
        const post = await db.blogPost.findUnique({
            where: { id },
            include: { series: true }
        })
        return post
    } catch (error) {
        return null
    }
}

const getCachedBlogPostBySlug = unstable_cache(
    async (slug: string) => {
        const post = await db.blogPost.findUnique({
            where: { slug },
            include: { series: true }
        })
        return post
    },
    ['blog-post-by-slug'],
    { revalidate: 3600, tags: ['blog'] }
)

export async function getBlogPostBySlug(slug: string) {
    try {
        return await getCachedBlogPostBySlug(slug)
    } catch (error) {
        return null
    }
}

const getCachedBlogPosts = unstable_cache(
    async () => {
        return await db.blogPost.findMany({
            orderBy: { createdAt: "desc" },
            include: { series: true }
        })
    },
    ['all-blog-posts'],
    { revalidate: 3600, tags: ['blog'] }
)

export async function getBlogPosts() {
    try {
        return await getCachedBlogPosts()
    } catch (error) {
        return []
    }
}

// Non-cached version for admin (always fresh)
export async function getAdminBlogPosts() {
    try {
        return await db.blogPost.findMany({
            orderBy: { createdAt: "desc" },
            include: { series: true }
        })
    } catch (error) {
        return []
    }
}

// ── Blog Series CRUD ──────────────────────────────────────────────

const getCachedBlogSeries = unstable_cache(
    async () => {
        return await db.blogSeries.findMany({
            include: {
                _count: {
                    select: { posts: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
    },
    ['all-blog-series'],
    { revalidate: 3600, tags: ['blog'] }
)

export async function getBlogSeries() {
    try {
        return await getCachedBlogSeries()
    } catch (error) {
        return []
    }
}

// Non-cached version for admin
export async function getAdminBlogSeries() {
    try {
        return await db.blogSeries.findMany({
            include: {
                _count: {
                    select: { posts: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
    } catch (error) {
        return []
    }
}

export async function getBlogSeriesById(id: string) {
    try {
        return await db.blogSeries.findUnique({
            where: { id },
            include: {
                posts: { orderBy: { createdAt: 'asc' } },
                _count: { select: { posts: true } }
            }
        })
    } catch (error) {
        return null
    }
}

const getCachedSeriesBySlug = unstable_cache(
    async (slug: string) => {
        return await db.blogSeries.findUnique({
            where: { slug },
            include: {
                posts: {
                    where: { published: true },
                    orderBy: { createdAt: 'asc' }
                }
            }
        })
    },
    ['blog-series-by-slug'],
    { revalidate: 3600, tags: ['blog'] }
)

export async function getSeriesBySlug(slug: string) {
    try {
        return await getCachedSeriesBySlug(slug)
    } catch (error) {
        return null
    }
}

export async function createBlogSeries(data: BlogSeriesData) {
    try {
        await db.blogSeries.create({ data })
        revalidateTag('blog', 'default')
        revalidatePath("/admin/blog")
        revalidatePath("/admin/blog/series")
        return { success: true }
    } catch (error) {
        console.error("Error creating blog series:", error)
        return { success: false, error: "Failed to create blog series" }
    }
}

export async function updateBlogSeries(id: string, data: BlogSeriesData) {
    try {
        await db.blogSeries.update({ where: { id }, data })
        revalidateTag('blog', 'default')
        revalidatePath("/admin/blog")
        revalidatePath("/admin/blog/series")
        return { success: true }
    } catch (error) {
        console.error("Error updating blog series:", error)
        return { success: false, error: "Failed to update blog series" }
    }
}

export async function deleteBlogSeries(id: string) {
    try {
        // First unlink all posts from this series
        await db.blogPost.updateMany({
            where: { seriesId: id },
            data: { seriesId: null }
        })
        await db.blogSeries.delete({ where: { id } })
        revalidateTag('blog', 'default')
        revalidatePath("/admin/blog")
        revalidatePath("/admin/blog/series")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to delete blog series" }
    }
}

// ── Legacy / Util ─────────────────────────────────────────────────

export async function generateDemoContent(): Promise<{ success: boolean; error?: string }> {
    // This is now handled via prisma seed but keeping the function to avoid build errors
    return { success: true }
}
