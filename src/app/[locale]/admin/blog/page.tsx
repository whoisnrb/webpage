
import { getAdminBlogPosts } from "@/app/actions/blog"
import { BlogListClient } from "./_components/blog-list-client"

export default async function AdminBlogPage() {
    const posts = await getAdminBlogPosts()

    // Serialize dates for client component
    const serializedPosts = posts.map((post: any) => ({
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        series: post.series ? {
            id: post.series.id,
            title: post.series.title,
        } : null,
    }))

    return <BlogListClient posts={serializedPosts as any} />
}
