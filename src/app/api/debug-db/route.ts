
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        // Test connection
        const postCount = await prisma.blogPost.count()
        
        // Test fetching a specific post (the one that fails)
        const slug = 'how-to-save-time-with-automation'
        const post = await prisma.blogPost.findUnique({
            where: { slug },
            include: { series: true }
        })

        return NextResponse.json({
            status: "success",
            connection: "ok",
            postCount,
            post: post ? {
                id: post.id,
                title: post.title,
                slug: post.slug,
                hasContent: !!post.content,
                createdAt: post.createdAt,
                hasSeries: !!post.series
            } : "not found"
        })
    } catch (error) {
        return NextResponse.json({
            status: "error",
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 })
    }
}
