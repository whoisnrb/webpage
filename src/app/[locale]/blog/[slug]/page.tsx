import { getBlogPostBySlug } from "@/app/actions/blog"
import ReactMarkdown from 'react-markdown'
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { routing } from '@/i18n/routing'

export const revalidate = 3600

type Props = {
    params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Props) {
    const { slug, locale } = await params
    const post = await getBlogPostBySlug(slug) as any

    if (!post) {
        return {
            title: 'Not Found',
        }
    }

    const title = locale === 'en' ? (post.titleEn || post.title) : post.title
    const excerpt = locale === 'en' ? (post.excerptEn || post.excerpt) : post.excerpt

    return {
        title: `${title} | BacklineIT Blog`,
        description: excerpt,
    }
}

export default async function BlogPostPage({ params }: Props) {
    const { slug, locale } = await params
    const post = await getBlogPostBySlug(slug) as any

    if (!post || !post.published) {
        notFound()
    }

    const title = locale === 'en' ? (post.titleEn || post.title) : post.title
    const content = locale === 'en' ? (post.contentEn || post.content) : post.content

    return (
        <article className="container mx-auto px-4 py-20 min-h-screen">
            <div className="max-w-3xl mx-auto">
                <Button variant="ghost" asChild className="mb-8">
                    <Link href="/blog">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
                    </Link>
                </Button>

                <h1 className="text-4xl md:text-6xl font-bold mb-8">
                    {title}
                </h1>

                <div className="flex items-center gap-4 text-muted-foreground mb-12">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="prose prose-neutral dark:prose-invert lg:prose-xl max-w-none">
                    <ReactMarkdown>{content || ''}</ReactMarkdown>
                </div>
            </div>
        </article>
    );
}
