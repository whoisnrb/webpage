import { getBlogPost, getBlogPosts } from "@/lib/mdx"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export async function generateStaticParams() {
    const posts = await getBlogPosts()
    return posts.map((post) => ({
        slug: post.slug,
    }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await getBlogPost(slug)

    if (!post) {
        notFound()
    }

    return (
        <article className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
            <Button variant="ghost" size="sm" asChild className="mb-8 text-muted-foreground hover:text-primary">
                <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Vissza a blogra
                </Link>
            </Button>

            <header className="mb-12 text-center">
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {post.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-primary border-primary/20">
                            {tag}
                        </Badge>
                    ))}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                    {post.title}
                </h1>
                <div className="flex items-center justify-center gap-6 text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {post.date}
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {post.author}
                    </div>
                </div>
            </header>

            <div className="prose prose-invert prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80">
                <MDXRemote source={post.content} />
            </div>
        </article>
    )
}
