import { prisma } from "@/lib/db"
import { Link } from "@/i18n/routing"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export default async function BlogPage() {
    // Fetch series
    const series = await prisma.blogSeries.findMany({
        include: {
            _count: {
                select: { posts: true }
            }
        }
    })

    // Fetch recent individual posts (optional, or mix them)
    const recentPosts = await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: { series: true }
    })

    return (
        <div className="container py-12">
            {series.length > 0 && (
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8">Tematikus Sorozatok</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {series.map(s => (
                            <Card key={s.id} className="flex flex-col h-full bg-muted/20">
                                <CardHeader>
                                    <CardTitle>{s.title}</CardTitle>
                                    <CardDescription>{s.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        {s._count.posts} fejezet
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Link href={`/blog/series/${s.slug}`} className="w-full">
                                        <Button className="w-full">Sorozat megtekintése</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            <h2 className="text-3xl font-bold mb-8">Legfrissebb Bejegyzések</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentPosts.map((post) => (
                    <Card key={post.id} className="flex flex-col h-full">
                        <CardHeader>
                            <div className="mb-2">
                                {post.series && (
                                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                                        {post.series.title}
                                    </span>
                                )}
                            </div>
                            <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                            </CardTitle>
                            <CardDescription className="line-clamp-3">
                                {post.excerpt}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="mt-auto">
                            <Link href={`/blog/${post.slug}`}>
                                <Button variant="link" className="px-0">Olvass tovább &rarr;</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
                {recentPosts.length === 0 && (
                    <p className="text-muted-foreground">Hamarosan...</p>
                )}
            </div>
        </div>
    )
}
