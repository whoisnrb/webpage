
import { getBlogPostBySlug } from "@/app/actions/blog"
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from "next/navigation"
import { Calendar, User, ArrowLeft, Clock, Share2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { getTranslations } from "next-intl/server"
import { SmartDate } from "@/components/ui/smart-date"
import { FadeIn } from "@/components/ui/motion-wrapper"
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
    const description = locale === 'en' ? (post.excerptEn || post.excerpt) : post.excerpt

    return {
        title: `${title} | BacklineIT Blog`,
        description: description,
        openGraph: {
            title: title,
            description: description,
            type: 'article',
            publishedTime: post.createdAt.toISOString(),
            authors: [post.author],
            tags: post.tags,
            images: post.coverImage ? [post.coverImage] : [],
        }
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
                    <MDXRemote source={content || ''} />
                </div>
            </div>
        </article>
    );
}
