"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getApprovedReviews() {
    try {
        const reviews = await prisma.review.findMany({
            where: {
                approved: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        // Serialize dates for Client Components
        return reviews.map(review => ({
            ...review,
            createdAt: review.createdAt.toISOString()
        }))
    } catch (error) {
        console.error("Failed to fetch reviews:", error)
        return []
    }
}

export async function getAllReviews() {
    try {
        const reviews = await prisma.review.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
        return reviews
    } catch (error) {
        console.error("Failed to fetch all reviews:", error)
        return []
    }
}

export async function approveReview(id: string) {
    try {
        await prisma.review.update({
            where: { id },
            data: { approved: true }
        })
        revalidatePath('/velemeny')
        return { success: true }
    } catch (error) {
        console.error("Failed to approve review:", error)
        return { success: false }
    }
}

export async function submitReview(data: { name: string, email?: string, content: string, rating: number, locale: string }) {
    try {
        const review = await prisma.review.create({
            data: {
                name: data.name,
                email: data.email,
                content: data.content,
                rating: data.rating,
                locale: data.locale,
                approved: false // Require manual approval
            }
        })
        return { success: true, id: review.id }
    } catch (error) {
        console.error("Failed to submit review:", error)
        return { success: false }
    }
}
