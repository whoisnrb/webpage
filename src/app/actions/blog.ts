
"use server"

import { prisma as db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

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
    seriesId?: string
}

export async function createBlogPost(data: BlogPostData) {
    try {
        await db.blogPost.create({
            data: {
                ...data,
                author: data.author || "BacklineIT Team",
            }
        })
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
            data
        })
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
        revalidatePath("/blog")
        revalidatePath("/admin/blog")
        return { success: true }
    } catch (error) {
        return { success: false, error: "Failed to delete blog post" }
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

export async function getBlogPostBySlug(slug: string) {
    try {
        const post = await db.blogPost.findUnique({
            where: { slug },
            include: { series: true }
        })
        return post
    } catch (error) {
        return null
    }
}

export async function getBlogPosts() {
    try {
        const posts = await db.blogPost.findMany({
            orderBy: { createdAt: "desc" },
            include: { series: true }
        })
        return posts
    } catch (error) {
        return []
    }
}

export async function getBlogSeries() {
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

export async function getSeriesBySlug(slug: string) {
    try {
        return await db.blogSeries.findUnique({
            where: { slug },
            include: {
                posts: {
                    where: { published: true },
                    orderBy: { createdAt: 'asc' }
                }
            }
        })
    } catch (error) {
        return null
    }
}
export async function generateDemoContent(): Promise<{ success: boolean; error?: string }> {
    // This is now handled via prisma seed but keeping the function to avoid build errors
    // and potentially calling a webhook or trigger in the future.
    return { success: true }
}

