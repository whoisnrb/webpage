
import { getBlogPostBySlug } from "@/app/actions/blog"
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from "next/navigation"
import { Calendar, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { getTranslations } from "next-intl/server"

type Props = {
    params: Promise<{ slug: string; locale: string }>
}

// Define compatible type locally
type BlogPost = {
    id: string
    title: string
    slug: string
    excerpt: string
    content: string
    author: string
    createdAt: Date
    tags: string[]
    published: boolean
    featured: boolean
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params
    const post = await getBlogPostBySlug(slug) as unknown as BlogPost

    if (!post) {
        return {
            title: 'Not Found',
        }
    }

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.createdAt.toISOString(),
            authors: [post.author],
            tags: post.tags,
        }
    }
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params
    const post = await getBlogPostBySlug(slug) as unknown as BlogPost

    if (!post || !post.published) {
        notFound()
    }

    const t = await getTranslations('Blog')

    return (
        <article className="container mx-auto px-4 py-16 md:py-24">
            <Button variant="ghost" asChild className="mb-8 hover:bg-transparent hover:text-primary -ml-4">
                <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('back_to_blog')}
                </Link>
            </Button>

            <div className="max-w-3xl mx-auto space-y-8">
                <div className="space-y-4">
                    <div className="flex gap-2">
                        {post.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm border-b pb-8">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {post.author}
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(post.createdAt), 'yyyy. MM. dd.')}
                        </div>
                    </div>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-primary hover:prose-a:underline">
                    <MDXRemote source={post.content} />
                </div>
            </div>
        </article>
    )
}
