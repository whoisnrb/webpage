
import { BlogPostForm } from "../_components/blog-post-form"
import { getAdminBlogSeries } from "@/app/actions/blog"

export default async function NewBlogPostPage() {
    const series = await getAdminBlogSeries()
    const seriesList = series.map((s: any) => ({ id: s.id, title: s.title }))

    return <BlogPostForm seriesList={seriesList} />
}
