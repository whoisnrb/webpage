
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

    const t = await getTranslations('Blog')

    const title = locale === 'en' ? (post.titleEn || post.title) : post.title
    const excerpt = locale === 'en' ? (post.excerptEn || post.excerpt) : post.excerpt
    const content = locale === 'en' ? (post.contentEn || post.content) : post.content

    return (
        <article className="min-h-screen">
            {/* Post Header / Hero */}
            <div className="relative py-16 md:py-24 border-b bg-muted/10">
                <div className="container mx-auto px-4">
                    <FadeIn>
                        <Button variant="ghost" asChild className="mb-8 hover:bg-transparent hover:text-primary -ml-4 group">
                            <Link href="/blog">
                                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                {t('back_to_blog')}
                            </Link>
                        </Button>

                        <div className="max-w-4xl mx-auto">
                            <div className="flex flex-wrap gap-2 mb-6">
                                {post.series && (
                                    <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 py-1">
                                        {locale === 'en' ? (post.series.titleEn || post.series.title) : post.series.title}
                                    </Badge>
                                )}
                                {post.tags.map((tag: string) => (
                                    <Badge key={tag} variant="outline" className="text-muted-foreground">{tag}</Badge>
                                ))}
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 leading-tight">
                                {title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        {post.author[0]}
                                    </div>
                                    <span className="font-medium text-foreground">{post.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <SmartDate date={post.createdAt} formatStr="PPP" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {Math.ceil(content.length / 1500)} min read
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* Post Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto">
                    <FadeIn delay={0.2} direction="none">
                        <div className="prose prose-neutral dark:prose-invert lg:prose-xl max-w-none 
                            prose-headings:scroll-mt-20 prose-a:text-primary hover:prose-a:underline 
                            prose-img:rounded-2xl prose-img:shadow-xl prose-pre:bg-muted/50 transition-all">
                            <MDXRemote source={content} />
                        </div>

                        {/* Footer / Share */}
                        <div className="mt-16 pt-8 border-t flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Tag className="w-4 h-4" /> Tags:
                                </span>
                                <div className="flex gap-2">
                                    {post.tags.map((tag: any) => (
                                        <Badge key={tag} variant="secondary" className="bg-muted/50">{tag}</Badge>
                                    ))}
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-full">
                                <Share2 className="w-4 h-4 mr-2" /> Share Article
                            </Button>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </article>
    )
}
