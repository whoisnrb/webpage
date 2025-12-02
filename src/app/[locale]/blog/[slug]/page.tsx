import { getPostBySlug, getAllPosts } from "@/lib/blog"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { FadeIn } from "@/components/ui/motion-wrapper"

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    const posts = getAllPosts()
    return posts.map((post) => ({
        slug: post.slug,
    }))
}

import { Metadata } from "next"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const post = getPostBySlug(slug)

    if (!post) {
        return {
            title: "Bejegyzés nem található",
        }
    }

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            publishedTime: post.date, // Assuming date format is compatible or needs parsing
            authors: ["BacklineIT Team"],
        },
    }
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params
    const post = getPostBySlug(slug)

    if (!post) {
        notFound()
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "author": {
            "@type": "Organization",
            "name": "BacklineIT Team"
        },
        "datePublished": post.date, // Ensure this is a valid ISO date string if possible, or leave as is
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://backlineit.hu/blog/${slug}`
        }
    }

    return (
        <article className="min-h-screen py-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="container mx-auto px-4 max-w-3xl">
                <FadeIn>
                    <div className="mb-8">
                        <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary mb-6" asChild>
                            <Link href="/blog" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Vissza a bloghoz
                            </Link>
                        </Button>

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-6 text-muted-foreground border-b border-border/40 pb-8 mb-8">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {post.date}
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                IT Services Team
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>
                </FadeIn>
            </div>
        </article>
    )
}
