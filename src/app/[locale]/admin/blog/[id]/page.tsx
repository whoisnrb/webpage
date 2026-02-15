
import { BlogPostForm } from "../_components/blog-post-form"
import { getBlogPostById, getAdminBlogSeries } from "@/app/actions/blog"
import { notFound } from "next/navigation"

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const [post, series] = await Promise.all([
        getBlogPostById(id),
        getAdminBlogSeries(),
    ])

    if (!post) {
        notFound()
    }

    const postData = {
        ...post,
        coverImage: post.coverImage ?? undefined,
        titleEn: post.titleEn ?? undefined,
        excerptEn: post.excerptEn ?? undefined,
        contentEn: post.contentEn ?? undefined,
        seriesId: post.seriesId ?? undefined,
    }

    const seriesList = series.map((s: any) => ({ id: s.id, title: s.title }))

    return <BlogPostForm initialData={postData as any} seriesList={seriesList} />
}
