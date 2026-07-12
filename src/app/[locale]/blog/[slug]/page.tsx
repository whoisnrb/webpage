import { getBlogPostBySlug } from "@/app/actions/blog"
import ReactMarkdown from 'react-markdown'
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/routing"
import { routing } from '@/i18n/routing'

export const revalidate = 3600

type Props = {
    params: Promise<{ slug: string; locale: string }>
}

import { getSeoMetadata } from "@/lib/seo"

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
        ...getSeoMetadata(locale, '/blog/[slug]', { slug })
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

    // Formatted Date
    const formattedDate = new Date(post.createdAt).toLocaleDateString(locale === 'hu' ? 'hu-HU' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <article className="min-h-screen pb-20">
            {/* Hero Section with Cover Image */}
            <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] mb-16 bg-muted overflow-hidden">
                {post.coverImage ? (
                    <img
                        src={post.coverImage}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                )}
                {/* Dark Gradient Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

                <div className="absolute inset-0 flex items-center justify-center pt-20">
                    <div className="container px-4 text-center">
                         <div className="flex flex-wrap justify-center gap-2 mb-6">
                            {post.tags?.map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md px-3 py-1 text-sm font-medium">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white max-w-4xl mx-auto tracking-tight leading-tight mb-8 drop-shadow-lg">
                            {title}
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-white/90 font-medium text-lg">
                            <span className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
                                    <span className="text-sm font-bold text-white">{post.author?.charAt(0) || 'B'}</span>
                                </div>
                                {post.author}
                            </span>
                            <span className="opacity-50">•</span>
                            <span>{formattedDate}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <Button variant="ghost" asChild className="mb-10 -ml-4 text-muted-foreground hover:text-foreground">
                        <Link href="/blog">
                            <ArrowLeft className="mr-2 h-4 w-4" /> {locale === 'hu' ? 'Vissza a bloghoz' : 'Back to Blog'}
                        </Link>
                    </Button>

                    {/* Typography container */}
                    <div className="prose prose-zinc dark:prose-invert prose-lg md:prose-xl max-w-none 
                        prose-headings:font-bold prose-headings:tracking-tight
                        prose-a:text-primary hover:prose-a:text-primary/80 prose-a:underline-offset-4
                        prose-img:rounded-2xl prose-img:shadow-xl
                        prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                        prose-li:marker:text-primary">
                        <ReactMarkdown>{content || ''}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </article>
    );
}
