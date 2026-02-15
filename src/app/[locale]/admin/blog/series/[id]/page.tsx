
import { BlogSeriesForm } from "../../_components/blog-series-form"
import { getBlogSeriesById } from "@/app/actions/blog"
import { notFound } from "next/navigation"

export default async function EditBlogSeriesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const series = await getBlogSeriesById(id)

    if (!series) {
        notFound()
    }

    const seriesData = {
        ...series,
        titleEn: series.titleEn ?? undefined,
        descriptionEn: series.descriptionEn ?? undefined,
        coverImage: series.coverImage ?? undefined,
    }

    return <BlogSeriesForm initialData={seriesData as any} />
}
