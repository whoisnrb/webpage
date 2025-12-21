
import { getBlogPosts } from "@/app/actions/blog"
import { Link } from "@/i18n/routing"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"
import { format } from "date-fns"

// Define a type since we can't fully rely on Prisma types being generated in this environment
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

export default async function BlogPage() {
    // Cast to any first to avoid TS errors if prisma types aren't recognized
    const allPosts = await getBlogPosts() as unknown as BlogPost[]
    const posts = allPosts.filter(p => p.published)
    const t = await getTranslations('Blog')

    return (
        <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                    {t('title')}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {t('subtitle')}
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <Card key={post.id} className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-all border-muted-foreground/10 group">
                        <div className="h-48 bg-muted/50 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute bottom-4 left-4 flex gap-2">
                                {post.tags.map((tag: string) => (
                                    <Badge key={tag} variant="secondary" className="backdrop-blur-sm bg-background/50">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <CardHeader>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {format(new Date(post.createdAt), 'yyyy. MM. dd.')}
                                </div>
                                <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {post.author}
                                </div>
                            </div>
                            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                                <Link href={`/blog/${post.slug}`}>
                                    {post.title}
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-muted-foreground line-clamp-3">
                                {post.excerpt}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="ghost" className="w-full group/btn" asChild>
                                <Link href={`/blog/${post.slug}`}>
                                    {t('read_more')} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
