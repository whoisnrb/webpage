import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { Link } from "@/i18n/routing"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"

export default async function SeriesPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    const series = await prisma.blogSeries.findUnique({
        where: { slug },
        include: {
            posts: {
                where: { published: true },
                orderBy: { createdAt: 'asc' }
            }
        }
    })

    if (!series) notFound()

    return (
        <div className="container py-12 max-w-4xl">
            <Link href="/blog">
                <Button variant="ghost" className="mb-8 pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Vissza a blogra
                </Button>
            </Link>

            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4">{series.title}</h1>
                <p className="text-xl text-muted-foreground">{series.description}</p>
            </header>

            <div className="space-y-6">
                {series.posts.map((post, index) => (
                    <Card key={post.id} className="relative overflow-hidden group hover:border-primary/50 transition-colors">
                        <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            {index + 1}
                        </div>
                        <div className="pl-16">
                            <CardHeader>
                                <CardTitle>
                                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                                        {post.title}
                                    </Link>
                                </CardTitle>
                                <CardDescription>{post.excerpt}</CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Link href={`/blog/${post.slug}`}>
                                    <Button size="sm">Ovasás</Button>
                                </Link>
                            </CardFooter>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
